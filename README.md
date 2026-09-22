# Caso 2: CRUD con Autenticación

## Descripción

En este caso, deberás implementar un CRUD para una entidad con autenticación basada en JWT. Además, deberás incluir paginación, filtrado y ordenamiento en las consultas.

## Historias de Usuario

1. **HU-01** : Como usuario nuevo, quiero tener la posibilidad de registrarme en la aplicación.
2. **HU-02** : Como usuario registrado, quiero tener la posibilidad de autenticarme en la aplicación.
3. **HU-03** : Como usuario autenticado, quiero poder crear registros.
4. **HU-04** : Como usuario autenticado, quiero poder listar registros con paginación.
5. **HU-05** : Como usuario autenticado, quiero poder filtrar registros por usuario que lo creó.
6. **HU-06** : Como usuario autenticado, quiero poder filtrar por registros creados por mí.
7. **HU-07** : Como usuario autenticado, quiero poder ordenar registros por fecha de creación.
8. **HU-08** : Como usuario autenticado, quiero poder actualizar y eliminar registros.

## Especificaciones

- Entidad sugerida: Post.
- Implementa autenticación con JWT.
- Usa paginación para listar registros.
- Añade endpoints para filtrar y ordenar.
- Construir una base de datos en MySQL y realizar migraciones con datos de ejemplo para la revisión.
- Realizar las validaciones respectivas en las entidades de Base de Datos.

## Detalles de las entidades

**Usuario**

- id: Autoincremental, Primary Key, Integer.
- name: string, not null.
- email: string, not null, email válida y único.
- password: string, not null, mínimo 8 carácteres, mínimo 1 mayúscula, 1 número y un carácter especial.

**Post**

- id: Autoincremental, Primary Key, Integer.
- title: string, not null.
- content: string, not null.
- user_id: Foreign Key de id (de la entidad Usuario), Implementar eliminación en cascada.

---

# Solución

## Puesta en marcha

Requisitos: Node.js 22.18+ (recomendado 24) y MySQL 8 (o Docker).

```bash
npm install
cp .env.example .env         # ajustar credenciales y JWT_SECRET
docker compose up -d         # MySQL 8.4 con los datos del .env
npm run db:create            # crea la base de datos prueba_tecnica_caso2
npm run db:migrate           # tablas users y posts
npm run db:seed              # 3 usuarios y 24 posts de ejemplo
npm run dev                  # http://localhost:3000
npm test                     # tests de integración (BD prueba_tecnica_caso2_test)
```

**Usuarios de ejemplo** (contraseña `Password123!`): `ana@example.com`, `bruno@example.com`, `carla@example.com`.

En [`api.http`](api.http) hay peticiones de ejemplo listas para usar (REST Client de VS Code o IntelliJ): el login guarda el token automáticamente para el resto.

## Arquitectura

Arquitectura en capas por módulo, con las dependencias externas (hash de contraseñas y JWT) detrás de interfaces:

```
Router → [authenticate] → Controller → Service → Model (Sequelize)
                                          │
                                          ├── PasswordHasher  (bcrypt)
                                          └── TokenService    (JWT)
```

```
src/
├── app.ts / routes.ts              # app de Express y raíz de composición (inyección manual)
├── types/express.d.ts              # req.user tipado
└── modules/
    ├── auth/
    │   ├── auth.controller.ts      # register / login / me
    │   ├── auth.service.ts         # reglas de registro y login
    │   ├── auth.middleware.ts      # authenticate: valida el Bearer token → req.user
    │   ├── auth.schemas.ts         # validación Zod de entrada
    │   ├── password.policy.ts      # regla de contraseña compartida por Zod y el modelo
    │   ├── password.hasher.ts      # interfaz PasswordHasher + adaptador bcrypt
    │   └── token.service.ts        # interfaz TokenService + adaptador JWT
    ├── users/                      # modelo User (hash en hook, contraseña oculta por defecto)
    └── posts/                      # modelo, esquemas, servicio, controlador y mapper
```

- **SOLID:** `AuthService` depende de las abstracciones `PasswordHasher` y `TokenService` (inversión de dependencias); cambiar bcrypt o JWT no toca la lógica. El middleware de autenticación recibe el `TokenService` por parámetro.
- **DRY:** la política de contraseñas se define una sola vez (`password.policy.ts`) y se aplica en la entrada (Zod) y en la entidad (Sequelize). Las rutas REST se registran con `crudRouter`, y la paginación y las respuestas vienen de `shared/`.
- **KISS:** filtros y orden como _query params_ del mismo endpoint de listado, sin endpoints duplicados.

## Base de datos

| Tabla   | Columnas                                                                                                                                             |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `users` | `id` INT PK AI · `name` VARCHAR(100) NOT NULL · `email` VARCHAR(150) NOT NULL UNIQUE · `password` VARCHAR(255) NOT NULL (hash bcrypt) · timestamps   |
| `posts` | `id` INT PK AI · `title` VARCHAR(150) NOT NULL · `content` TEXT NOT NULL · `user_id` INT NOT NULL FK → `users.id` **ON DELETE CASCADE** · timestamps |

- La contraseña se valida en la entidad (`validate.is` con la política) **antes** de que el hook `beforeSave` la reemplace por su hash. El _scope_ por defecto nunca devuelve la columna `password`.
- Índices en `posts(user_id, created_at)` y `posts(created_at)` para los filtros y el orden.

## Endpoints

Base: `http://localhost:3000/api`. 🔒 = requiere `Authorization: Bearer <token>`.

| Método   | Ruta             | Descripción                                      | HU       |
| -------- | ---------------- | ------------------------------------------------ | -------- |
| `POST`   | `/auth/register` | Registro → `{ token, user }`                     | HU-01    |
| `POST`   | `/auth/login`    | Login → `{ token, user }`                        | HU-02    |
| `GET`    | `/auth/me` 🔒    | Perfil del usuario autenticado                   |          |
| `GET`    | `/users` 🔒      | Lista de usuarios (para filtrar posts por autor) |          |
| `POST`   | `/posts` 🔒      | Crea un post del usuario autenticado             | HU-03    |
| `GET`    | `/posts` 🔒      | Listado paginado con filtros y orden (ver abajo) | HU-04…07 |
| `GET`    | `/posts/:id` 🔒  | Detalle de un post                               |          |
| `PUT`    | `/posts/:id` 🔒  | Reemplaza un post (solo su autor)                | HU-08    |
| `PATCH`  | `/posts/:id` 🔒  | Actualiza parcialmente un post (solo su autor)   | HU-08    |
| `DELETE` | `/posts/:id` 🔒  | Elimina un post (solo su autor)                  | HU-08    |

### Parámetros de `GET /posts`

| Parámetro  | Ejemplo        | Descripción                                      | HU    |
| ---------- | -------------- | ------------------------------------------------ | ----- |
| `page`     | `?page=2`      | Página (por defecto 1)                           | HU-04 |
| `pageSize` | `?pageSize=20` | Tamaño de página (por defecto 10, máximo 100)    | HU-04 |
| `userId`   | `?userId=3`    | Solo los posts de ese usuario                    | HU-05 |
| `mine`     | `?mine=true`   | Solo mis posts                                   | HU-06 |
| `sort`     | `?sort=asc`    | Orden por fecha de creación (`desc` por defecto) | HU-07 |

Se pueden combinar, por ejemplo `GET /posts?mine=true&sort=asc&page=1&pageSize=5`.

```jsonc
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 24,
        "title": "…",
        "content": "…",
        "userId": 3,
        "author": { "id": 3, "name": "Carla Rojas" },
        "createdAt": "…",
      },
    ],
    "total": 24,
    "page": 1,
    "pageSize": 10,
    "totalPages": 3,
  },
}
```

### Errores

| Estado | Código                                                    | Cuándo                                             |
| ------ | --------------------------------------------------------- | -------------------------------------------------- |
| 400    | `VALIDATION_ERROR` / `BAD_REQUEST`                        | Datos o parámetros inválidos                       |
| 401    | `TOKEN_MISSING` / `TOKEN_INVALID` / `INVALID_CREDENTIALS` | Sin token, token inválido/expirado o login fallido |
| 403    | `FORBIDDEN`                                               | Modificar o eliminar un post ajeno                 |
| 404    | `POST_NOT_FOUND` / `ROUTE_NOT_FOUND`                      | El recurso o la ruta no existen                    |
| 409    | `EMAIL_ALREADY_EXISTS`                                    | Registro con un email ya usado                     |
| 500    | `INTERNAL_ERROR`                                          | Cualquier error no contemplado                     |
