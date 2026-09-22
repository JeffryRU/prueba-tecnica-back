# Evaluación Práctica de Express

Solución a la evaluación práctica de Express de InversionesBullbet: tres casos independientes, desde un CRUD básico hasta autenticación con JWT y Arquitectura Hexagonal con DDD.

> **Enunciados:** cada caso vive en su rama (`ejercicio-1`, `ejercicio-2`, `ejercicio-3`) junto con su README original. El README del repositorio original los llama `caso-1/2/3`, pero las ramas reales se llaman `ejercicio-N`.

## Stack

| Tecnología | Uso |
|---|---|
| Node.js 24 + TypeScript | Ejecución directa de `.ts` (*type stripping* nativo de Node, sin compilación) |
| Express 5 | Servidor HTTP (propaga errores de handlers `async` de forma nativa) |
| MySQL 8 + Sequelize 6 | Base de datos y ORM |
| Umzug | Migraciones y seeders escritos en TypeScript |
| Zod | Validación de peticiones y variables de entorno |
| JWT + bcrypt | Autenticación (casos 2 y 3) |

**Restricciones del `tsconfig` original que condicionan el código:**
- `erasableSyntaxOnly`: no se pueden usar `enum`, `namespace`, *parameter properties* (`constructor(private repo: X)`) ni decoradores. Se usan uniones de literales / objetos `as const` y campos declarados de forma explícita.
- Imports con extensión `.ts` (`import { x } from './x.ts'`), porque Node ejecuta los archivos tal cual.

## Estrategia de ramas

```
main         ── plan e índice (este README)
develop      ── estructura base común
               ├── ejercicio-1   Caso 1: CRUD básico (Libro / Autor)
               ├── ejercicio-2   Caso 2: CRUD con JWT (Usuario / Post)
               └── ejercicio-3   Caso 3: Arquitectura Hexagonal + DDD
```

Los casos son **proyectos independientes** (entidades y arquitecturas distintas), así que cada `ejercicio-N` sale de `develop` y **no** se vuelve a fusionar en él. `develop` solo contiene lo que comparten los tres: configuración, conexión a la base de datos, migraciones, manejo de errores y herramientas.

## Plan por caso

### Caso 1 – CRUD básico · rama `ejercicio-1`
Entidades **Autor** (1) → **Libro** (N), con eliminación en cascada.

- [ ] Migraciones de `authors` y `books` con restricciones (`NOT NULL`, email único, FK `ON DELETE CASCADE`).
- [ ] Seeders con datos de ejemplo.
- [ ] Modelos Sequelize con validaciones (email válido, precio numérico).
- [ ] CRUD de libros; listado y detalle incluyen su autor (HU-01 … HU-05).
- [ ] CRUD de autores para poder asignar la relación.
- [ ] Validación de peticiones con Zod; errores con estados HTTP adecuados y 500 para lo inesperado.
- [ ] Arquitectura en capas: rutas → controladores → servicios → modelos.

### Caso 2 – CRUD con autenticación · rama `ejercicio-2`
Entidades **Usuario** (1) → **Post** (N), con eliminación en cascada.

- [ ] Registro (HU-01) y login (HU-02) con JWT; contraseñas con hash bcrypt.
- [ ] Contraseña: mínimo 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial.
- [ ] Middleware de autenticación para las rutas de posts.
- [ ] Crear posts (HU-03) y listar con paginación (HU-04).
- [ ] Filtrar por autor (`?userId=`, HU-05) y por los propios (`?mine=true`, HU-06).
- [ ] Ordenar por fecha de creación (`?sort=asc|desc`, HU-07).
- [ ] Actualizar y eliminar (HU-08), solo el autor del post.
- [ ] Migraciones y seeders.

### Caso 3 – Arquitectura Hexagonal + DDD · rama `ejercicio-3`
Bounded contexts: **IdentityAndAccess**, **CustomerManagement**, **ProductManagement**, **OrderManagement**, cada uno con sus capas `Domain` / `Application` / `Infrastructure`.

- [ ] IAM: registro e inicio de sesión con JWT; todas las rutas protegidas (HU-01, HU-02).
- [ ] Clientes: CRUD con paginación, filtro por nombre y orden por fecha asc/desc (HU-03 … HU-06).
- [ ] Productos: CRUD con filtro por categoría (`Electronics`, `Clothing`, `Books`) y orden por precio asc/desc (HU-07, HU-08).
- [ ] Órdenes: crear una orden con varios productos y cantidades (`order_items`) (HU-09).
- [ ] Historial de órdenes de un cliente con productos, cantidades y precios (HU-10).
- [ ] Total gastado por un cliente: Σ (precio unitario × cantidad) de todas sus órdenes (HU-11).
- [ ] Código QR por producto que muestra sus datos al escanearlo (HU-12).
- [ ] Contratos (interfaces) en el dominio e implementaciones Sequelize en infraestructura; *value objects* para email, precio, categoría y estado.
- [ ] Migraciones y seeders.

**Decisiones sobre inconsistencias del enunciado del caso 3:**
- `EloquentProductRepository` y `Routes/api.ts` (nombres de Laravel) → se usan `SequelizeProductRepository` y `Routes/Router.ts`, igual que en los demás contextos.
- El estado de la orden tiene como valor por defecto `"Pending"`, pero la lista de valores está en minúsculas → se usan minúsculas (`pending`, `processing`, `completed`, `declined`) con `pending` por defecto.
- `orders.total` es *nullable* → se calcula y guarda al crear la orden. El total gastado por cliente se calcula siempre desde los `order_items`.

## Requisitos y ejecución

Las instrucciones detalladas de instalación, base de datos y scripts están en el README de `develop` y de cada rama `ejercicio-N`.

```bash
git clone https://github.com/JeffryRU/prueba-tecnica-back.git
cd prueba-tecnica-back
git checkout ejercicio-1   # o ejercicio-2 / ejercicio-3
npm install
```

---

## Enunciado original

<details>
<summary>README original del repositorio</summary>

Bienvenido al repositorio de evaluación práctica de Express. Este repositorio contiene tres casos prácticos diseñados para evaluar tus habilidades en el desarrollo con Express. Cada caso está diseñado para medir diferentes aspectos del framework, desde la implementación básica de CRUD hasta el uso de autenticación con JWT y la aplicación de la Arquitectura Hexagonal.

1. Clona este repositorio en tu máquina local.
2. Instala las dependencias necesarias con `npm install`.
3. Configura tu archivo .env con las credenciales de tu base de datos.
4. Lee cuidadosamente las instrucciones de cada caso antes de comenzar.

- **Caso 1**: Implementación básica de un CRUD sin autenticación.
- **Caso 2**: Implementación de un CRUD con autenticación usando JWT, paginación, filtrado y ordenamiento.
- **Caso 3**: Implementación de un CRUD aplicando la Arquitectura Hexagonal.

</details>
