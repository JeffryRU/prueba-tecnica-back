# Caso 1: CRUD Básico

## Descripción

En este caso, deberás implementar un CRUD básico para una o más entidades sin autenticación. El objetivo es evaluar tu capacidad para trabajar con las operaciones básicas de Express (Create, Read, Update, Delete) siguiendo cualquier arquitectura (A elección del practicante).

## Historias de Usuario

1. **HU-01** : Como usuario, quiero poder crear registros para una entidad principal (Libro) y asignarlos a una entidad relacionada (Autor).
2. **HU-02** : Como usuario, quiero poder listar todos los libros junto con su autor correspondiente.
3. **HU-03** : Como usuario, quiero poder ver los detalles de un libro específico, incluyendo su autor.
4. **HU-04** : Como usuario, quiero poder actualizar un libro existente, incluyendo su relación con el autor.
5. **HU-05** : Como usuario, quiero poder eliminar un libro.

## Especificaciones

- Entidades sugeridas: Libro (principal) y Autor (relacionada).
- Implementa una relación de uno a muchos (1:N) : Un autor puede tener muchos libros, pero un libro pertenece a un solo autor.
- No es necesario implementar autenticación.
- Incluye validaciones básicas en los formularios.
- Asegúrate de mostrar correctamente las relaciones en las vistas.
- Implementar manejo de errores predeterminados, para errores no tan comunes usar status 500.
- Construir una base de datos en MySQL y realizar migraciones con datos de ejemplo para la revisión.
- Realizar las validaciones respectivas en las entidades de Base de Datos.

## Detalles de las entidades

**Autor**

- id: Autoincremental, Primary Key, Integer.
- name: string, not null.
- email: string, not null, email válida y único.

**Libro**

- id: Autoincremental, Primary Key, Integer.
- title: string, not null.
- description: string, not null.
- price: float, not null.
- author_id: Foreign Key de id (de la entidad Autor), Implementar eliminación en cascada.

---

# Solución

## Puesta en marcha

Requisitos: Node.js 22.18+ (recomendado 24) y MySQL 8 (o Docker).

```bash
npm install
cp .env.example .env         # ajustar credenciales si no se usa Docker
docker compose up -d         # MySQL 8.4 con los datos del .env
npm run db:create            # crea la base de datos prueba_tecnica_caso1
npm run db:migrate           # tablas authors y books
npm run db:seed              # 4 autores y 9 libros de ejemplo
npm run dev                  # http://localhost:3000
npm test                     # tests de integración (BD prueba_tecnica_caso1_test)
```

En [`api.http`](api.http) hay peticiones de ejemplo listas para usar (extensión REST Client de VS Code o IntelliJ).

## Arquitectura

Arquitectura en capas organizada por módulo. Cada capa tiene una única responsabilidad y depende solo de la siguiente:

```
Router  →  Controller  →  Service  →  Model (Sequelize)
(rutas)    (HTTP + Zod)   (reglas)    (persistencia)
```

```
src/
├── app.ts                          # app de Express: JSON, /health, /api, errores
├── routes.ts                       # raíz de composición: instancia servicios y controladores
├── modules/
│   ├── authors/
│   │   ├── author.model.ts         # modelo + validaciones de BD
│   │   ├── author.schemas.ts       # validación de entrada (Zod)
│   │   ├── author.service.ts       # lógica de negocio
│   │   ├── author.controller.ts    # traduce HTTP ⇄ servicio
│   │   └── author.mapper.ts        # modelo → respuesta JSON
│   └── books/                      # misma estructura + asociación 1:N con Author
└── shared/
    ├── database/                   # conexión, migraciones, seeders y CLI db:*
    ├── errors/AppError.ts          # errores controlados (código + estado HTTP)
    └── http/                       # sobre de respuesta, errores, :id y rutas CRUD
```

- **SOLID:** cada clase tiene una sola responsabilidad; `BookService` recibe por constructor solo lo que necesita del servicio de autores (`Pick<AuthorService, 'exists'>`), lo que facilita sustituirlo en tests.
- **DRY:** las 6 rutas REST de cada recurso se registran con `crudRouter`; errores, respuestas y validación de `:id` son compartidos.
- **KISS:** sin capas extra que el caso no necesita; Sequelize se usa directamente desde los servicios.

## Base de datos

| Tabla     | Columnas                                                                                                                                                                                      |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `authors` | `id` INT PK AI · `name` VARCHAR(100) NOT NULL · `email` VARCHAR(150) NOT NULL UNIQUE · `created_at` · `updated_at`                                                                            |
| `books`   | `id` INT PK AI · `title` VARCHAR(150) NOT NULL · `description` VARCHAR(500) NOT NULL · `price` FLOAT NOT NULL · `author_id` INT NOT NULL FK → `authors.id` **ON DELETE CASCADE** · timestamps |

Las validaciones se aplican en tres niveles: Zod (entrada HTTP), modelo Sequelize (`notEmpty`, `isEmail`, `min`) y restricciones de la BD (`NOT NULL`, `UNIQUE`, FK).

## Endpoints

Base: `http://localhost:3000/api`

| Método   | Ruta           | Descripción                                            | HU    |
| -------- | -------------- | ------------------------------------------------------ | ----- |
| `POST`   | `/books`       | Crea un libro asignado a un autor                      | HU-01 |
| `GET`    | `/books`       | Lista los libros con su autor (`?authorId=` opcional)  | HU-02 |
| `GET`    | `/books/:id`   | Detalle de un libro con su autor                       | HU-03 |
| `PUT`    | `/books/:id`   | Reemplaza un libro (incluida la relación con el autor) | HU-04 |
| `PATCH`  | `/books/:id`   | Actualiza parcialmente un libro                        | HU-04 |
| `DELETE` | `/books/:id`   | Elimina un libro                                       | HU-05 |
| `GET`    | `/authors`     | Lista los autores                                      |       |
| `GET`    | `/authors/:id` | Detalle de un autor con sus libros                     |       |
| `POST`   | `/authors`     | Crea un autor                                          |       |
| `PUT`    | `/authors/:id` | Reemplaza un autor                                     |       |
| `PATCH`  | `/authors/:id` | Actualiza parcialmente un autor                        |       |
| `DELETE` | `/authors/:id` | Elimina un autor **y sus libros** (cascada)            |       |
| `GET`    | `/health`      | Estado del servidor y de la BD (fuera de `/api`)       |       |

### Formato de respuesta

```jsonc
// Éxito
{ "success": true, "message": "Libro creado", "data": { "id": 10, "title": "…", "author": { "id": 1, "name": "…", "email": "…" } } }

// Error
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Los datos proporcionados son inválidos", "details": [{ "field": "price", "message": "El precio no puede ser negativo" }] } }
```

| Estado | Código                                                    | Cuándo                                    |
| ------ | --------------------------------------------------------- | ----------------------------------------- |
| 400    | `VALIDATION_ERROR` / `BAD_REQUEST`                        | Datos inválidos o JSON mal formado        |
| 404    | `BOOK_NOT_FOUND` / `AUTHOR_NOT_FOUND` / `ROUTE_NOT_FOUND` | El recurso o la ruta no existen           |
| 409    | `DUPLICATE_ENTRY`                                         | Email de autor ya registrado              |
| 422    | `AUTHOR_NOT_FOUND`                                        | Se asigna un libro a un autor inexistente |
| 500    | `INTERNAL_ERROR`                                          | Cualquier error no contemplado            |
