# Caso 3: CRUD con Arquitectura Hexagonal

## Descripción

En este caso, deberás implementar un sistema que gestione tres entidades relacionadas (`Order`, `Customer`, `Product`) utilizando la Arquitectura Hexagonal y aplicando principios de DDD (Domain-Driven Design) . El objetivo es evaluar tu capacidad para estructurar el código en contextos delimitados (Bounded Contexts ) y separar las capas de dominio, aplicación e infraestructura.

Este caso está diseñado para evaluar habilidades avanzadas en Express, incluyendo la implementación de autenticación, operaciones CRUD, filtros, ordenamiento, entre otras, todo organizado bajo los principios de DDD.

## Historias de Usuario

1. **HU-01** : Como usuario, quiero poder registrarme en el sistema proporcionando mi nombre, correo electrónico y contraseña para acceder a las funcionalidades protegidas.
2. **HU-02** : Como usuario registrado, quiero poder iniciar sesión en el sistema utilizando mi correo electrónico y contraseña para acceder a mis datos y realizar operaciones.
3. **HU-03** : Como usuario autenticado, quiero poder crear nuevos clientes para gestionar sus órdenes posteriormente.
4. **HU-04** : Como usuario autenticado, quiero poder listar todos los clientes registrados en el sistema, con opciones de paginación, filtrado por nombre y ordenamiento por fecha de creación.
5. **HU-05** : Como usuario autenticado, quiero poder actualizar la información de un cliente existente para mantener los datos actualizados.
6. **HU-06** : Como usuario autenticado, quiero poder eliminar un cliente del sistema si ya no es necesario.
7. **HU-07** : Como usuario autenticado, quiero poder crear nuevos productos para asociarlos a las órdenes de los clientes.
8. **HU-08** : Como usuario autenticado, quiero poder listar todos los productos disponibles en el sistema, con opciones de filtrado por categoría y ordenamiento por precio.
9. **HU-09** : Como usuario autenticado, quiero poder crear órdenes asociando productos específicos a un cliente determinado.
10. **HU-10** : Como usuario autenticado, quiero poder ver el historial de órdenes de un cliente específico, mostrando los detalles de cada orden (productos asociados, cantidades y precios).
11. **HU-11** : Como usuario autenticado, quiero poder calcular el total gastado por un cliente en todas sus órdenes, considerando el precio unitario de los productos y las cantidades asociadas.
12. **HU-12** : Como usuario autenticado, quiero que cada producto tenga un código QR asociado que al escanearlo me muestre los datos del producto.

## Especificaciones

### Autenticación

- Implementa registro e inicio de sesión usando **JWT**.
- Asegúrate de que todas las rutas estén protegidas mediante middleware de autenticación.

### Código QR

- Implementa endpoints para generar código QR.
- Asocia el código QR a información del producto.

### Operaciones CRUD

- Implementa operaciones CRUD para las entidades `Customer`, `Product` y `Order`.
- Usa la **Arquitectura Hexagonal** para separar las capas de dominio, aplicación e infraestructura.

### Filtros y Ordenamiento

- En el listado de clientes, permite:

  - Filtrar por nombre.
  - Ordenar por fecha de creación (Ascendente/Descendente).

- En el listado de productos, permite:

  - Filtrar por categoría.
  - Ordenar por precio (Ascendente/Descendente).

### Relaciones

- Implementa una función que calcule el total gastado por un cliente en todas sus órdenes. Esta función debe:

  - Recorrer las órdenes del cliente.
  - Multiplicar el precio unitario de cada producto por su cantidad en la orden.
  - Sumar los totales de todas las órdenes.

## Bounded Contexts

### 1. Contexto de Identidad y Acceso (Identity & Access Management - IAM)

- **Responsabilidad** : Gestionar la autenicación y autorización de usuarios.
- **Entidades** :
  - `User`: Representa a los usuarios del sistema.
- **Casos de Uso** :
  - Registro de usuarios.
  - Inicio de sesión.
- **Directorio** :

```
src/IdentityAndAccess/User/
├── Domain/
│   ├── Entities/User.ts
│   ├── Contract/UserContract.ts
│   └── ValueObjects/*
├── Application/
│   ├── RegisterUseCase.ts
│   └── LoginUseCase.ts
└── Infrastructure/
    ├── Controllers/AuthController.ts
    ├── Validators/*
    ├── Routes/Router.ts
    └── Repositories/SequelizeUserRepository.ts
```

### 2. Contexto de Gestión de Clientes (Customer Management)

- **Responsabilidad** : Gestionar la creación, actualización, eliminación y consulta de clientes.
- **Entidades** :
  - `Customer` : Representa a los clientes.
- **Casos de Uso** :
  - Crear cliente.
  - Listar clientes (con filtros y ordenamiento).
  - Actualizar cliente.
  - Eliminar cliente.
- **Directorio** :

```
src/CustomerManagement/Customer/
├── Domain/
│   ├── Entities/Customer.ts
│   ├── Contract/CustomerContract.ts
│   └── ValueObjects/*
├── Application/
│   ├── CreateCustomerUseCase.ts
│   ├── ListCustomersUseCase.ts
│   ├── UpdateCustomerUseCase.ts
│   └── DeleteCustomerUseCase.ts
└── Infrastructure/
    ├── Controllers/CustomerController.ts
    ├── Validators/*
    ├── Routes/Router.ts
    └── Repositories/SequelizeCustomerRepository.ts
```

### 3. Contexto de Gestión de Productos (Product Management)

- **Responsabilidad** : Gestionar la creación, actualización, eliminación y consulta de productos.
- **Entidades** :
  - `Product`: Representa a los productos del sistema.
- **Casos de Uso** :
  - Crear producto.
  - Listar productos (con filtros y ordenamiento).
  - Actualizar producto.
  - Eliminar producto.
- **Directorio** :

```
src/ProductManagement/Product/
├── Domain/
│   ├── Entities/Product.ts
│   ├── Contract/ProductContract.ts
│   └── ValueObjects/*
├── Application/
│   ├── CreateProductUseCase.ts
│   ├── ListProductsUseCase.ts
│   ├── UpdateProductUseCase.ts
│   ├── DeleteProductUseCase.ts
│   └── GenerateQrUseCase.ts
└── Infrastructure/
    ├── Controllers/ProductController.ts
    ├── Controllers/QrController.ts
    ├── Validators/*
    ├── Routes/api.ts
    └── Repositories/EloquentProductRepository.ts
```

### 4. Contexto de Gestión de Órdenes (Order Management)

- **Responsabilidad** : Gestionar la creación, consulta y cálculo de órdenes.
- **Entidades** :
  - `Order`: Representa una orden.
  - `OrderItem`: Representa un producto asociado a una orden con su cantidad.
- **Casos de Uso** :
  - Crear orden.
  - Consultar historial de órdenes de un cliente.
  - Calcular el total gastado por un cliente.
- **Directorio** :

```
src/OrderManagement/Order/
├── Domain/
│   ├── Entities/Order.ts
│   ├── Entities/OrderItem.ts
│   ├── Contract/OrderContract.ts
│   └── ValueObjects/*
├── Application/
│   ├── CreateOrder.ts
│   ├── ListOrdersByCustomer.ts
│   └── CalculateTotalSpentByCustomer.ts
└── Infrastructure/
    ├── Controllers/OrderController.ts
    ├── Validators/*
    ├── Routes/Router.ts
    └── Repositories/SequelizeOrderRepository.ts
```

## Bases de datos

**Usuario**

- id: Autoincremental, Primary Key, Integer.
- name: string, not null.
- email: string, not null, email válida y único.
- password: string, not null, mínimo 8 carácteres, mínimo 1 mayúscula, 1 número y un carácter especial.

**Cliente**

- id: Autoincremental, Primary Key, Integer.
- name: string, not null.
- email: string, not null, email válida y único.

**Producto**

- id: Autoincremental, Primary Key, Integer.
- name: string, not null.
- category: string, not null, las categorías son: Electronics, Clothing, Books.
- price: float, not null.

**Orden**

- id: Autoincremental, Primary Key, Integer.
- status: string, not null, valor por defecto "Pending", los status son: pending, processing, completed, declined.
- total: float, nullable.
- shipping_address: text, nullable.
- shipped_at: timestamp, nullable.
- customer_id: Foreign Key de id (de la entidad Cliente), Implementar eliminación en cascada.

**Orden-Producto (Tabla Intermedia)**

- id: Autoincremental, Primary Key, Integer.
- order_id: Foreign Key de id (de la entidad Orden), Implementar eliminación en cascada.
- product_id: Foreign Key de id (de la entidad Producto), Implementar eliminación en cascada.
- quantity: integer, not null, valor por defecto 1

## Consejos

1. **Organización del Código** : Asegúrate de que cada contexto tenga su propia carpeta y siga la estructura de Dominio , Aplicación e Infraestructura.
2. **Interfaces** : Define interfaces en el nivel de Dominio y proporciona implementaciones concretas en Infraestructura.

## Tutoriales

Puedes guiarte buscando información acerca de arquitectura hexagonal con Typescript y node js en los siguientes videos que se adjuntan donde se explica teoría y práctica acerca de esto.

1. Arquitectura Hexagonal - Dominio: https://youtu.be/H0Sbna9rxog
2. Arquitectura Hexagonal - Aplicación: https://youtu.be/EcmRo9LUfyE
3. Arquitectura Hexagonal - Infraestructura: https://youtu.be/np7nOWWZHtU
4. Arquitectura Hexagonal - Testeando el API: https://youtu.be/7PKmEXHbGWI

---

# Solución

## Puesta en marcha

Requisitos: Node.js 22.18+ (recomendado 24) y MySQL 8 (o Docker).

```bash
npm install
cp .env.example .env         # ajustar credenciales y JWT_SECRET
docker compose up -d         # MySQL 8.4 con los datos del .env
npm run db:create            # crea la base de datos prueba_tecnica_caso3
npm run db:migrate           # users, customers, products, orders, order_items
npm run db:seed              # usuario demo, 12 clientes, 12 productos y 8 órdenes
npm run dev                  # http://localhost:3000
npm test                     # 18 tests unitarios + 19 de integración
```

**Usuario de ejemplo:** `admin@example.com` / `Password123!`

En [`api.http`](api.http) hay peticiones de ejemplo para cada historia de usuario (REST Client de VS Code o IntelliJ).

## Arquitectura hexagonal

```
                    ┌──────────────── Infrastructure ────────────────┐
  HTTP  ──────────▶ │ Routes → Controllers → Validators (Zod)        │
                    │            │                                   │
                    │            ▼                                   │
                    │   ┌──────── Application ────────┐              │
                    │   │   Casos de uso (execute)    │              │
                    │   │            │                │              │
                    │   │   ┌──── Domain ────┐        │              │
                    │   │   │ Entities       │        │              │
                    │   │   │ ValueObjects   │        │              │
                    │   │   │ Contract (⇦ puertos)    │              │
                    │   │   └────────────────┘        │              │
                    │   └─────────────────────────────┘              │
                    │  Repositories (Sequelize) · Adapters (JWT,     │
                    │  bcrypt, QR, otros contextos) implementan los  │
                    │  contratos del dominio                         │
                    └────────────────────────────────────────────────┘
```

- **Regla de dependencias:** Infrastructure → Application → Domain, nunca al revés. El dominio no importa Express, Sequelize ni ninguna librería externa.
- **Puertos y adaptadores:** cada dependencia externa es una interfaz del dominio (`Contract/`) con una implementación en infraestructura: repositorios Sequelize, `BcryptPasswordHasher`, `JwtTokenService` y `QrcodeGenerator`.
- **Errores de dominio sin HTTP:** el dominio lanza `InvalidArgumentError`, `NotFoundError`, `ConflictError` o `UnauthorizedError` con un código estable (`INVALID_PRICE`, `CUSTOMER_NOT_FOUND`…). El manejador HTTP los traduce a 400, 404, 409 o 401.
- **Entidades inmutables** con _value objects_ que se autovalidan (`Email`, `Name`, `Password`, `Price`, `ProductCategory`, `OrderStatus`, `Quantity`). Una entidad inválida no se puede construir.
- **Raíz de composición única** ([`src/routes.ts`](src/routes.ts)): es el único punto que conoce las clases concretas y las inyecta por constructor.

### Bounded contexts

```
src/
├── IdentityAndAccess/User/
│   ├── Domain/          Entities/User.ts · Contract/{UserContract, PasswordHasher, TokenService}.ts · ValueObjects/Password.ts
│   ├── Application/     RegisterUseCase.ts · LoginUseCase.ts · AuthSession.ts
│   └── Infrastructure/  Controllers/AuthController.ts · Validators/ · Routes/Router.ts · Repositories/SequelizeUserRepository.ts
│                        Models/ · Adapters/{BcryptPasswordHasher, JwtTokenService}.ts · Middleware/Authenticate.ts
├── CustomerManagement/Customer/
│   ├── Domain/          Entities/Customer.ts · Contract/CustomerContract.ts
│   ├── Application/     Create/List/Get/Update/DeleteCustomerUseCase.ts
│   └── Infrastructure/  Controllers/CustomerController.ts · Validators/ · Routes/Router.ts · Repositories/SequelizeCustomerRepository.ts · Models/
├── ProductManagement/Product/
│   ├── Domain/          Entities/Product.ts · Contract/{ProductContract, QrCodeGenerator}.ts · ValueObjects/{Price, ProductCategory}.ts
│   ├── Application/     Create/List/Get/Update/DeleteProductUseCase.ts · GenerateQrUseCase.ts
│   └── Infrastructure/  Controllers/{ProductController, QrController}.ts · Validators/ · Routes/api.ts
│                        Repositories/SequelizeProductRepository.ts · Models/ · Adapters/QrcodeGenerator.ts
├── OrderManagement/Order/
│   ├── Domain/          Entities/{Order, OrderItem}.ts · Contract/{OrderContract, CustomerDirectory, ProductCatalog}.ts
│   │                    ValueObjects/{OrderStatus, Quantity}.ts
│   ├── Application/     CreateOrder.ts · ListOrdersByCustomer.ts · CalculateTotalSpentByCustomer.ts · Get/List/Update/DeleteOrder.ts
│   └── Infrastructure/  Controllers/OrderController.ts · Validators/ · Routes/Router.ts · Repositories/SequelizeOrderRepository.ts
│                        Models/ · Adapters/{CustomerDirectoryAdapter, ProductCatalogAdapter}.ts
└── shared/              Núcleo compartido: domain/ (DomainError, Email, Name, Pagination, money) + config, database y http
```

**Comunicación entre contextos:** el contexto de órdenes no accede a los repositorios de otros contextos desde su dominio. Define sus propios puertos (`CustomerDirectory` y `ProductCatalog`, con solo lo que necesita), y los adaptadores de su infraestructura los implementan sobre los contratos de Customer y Product (_anti-corruption layer_).

### Principios

- **SOLID:** un caso de uso por clase (SRP). Los contratos permiten añadir implementaciones sin modificar la lógica (OCP/LSP). Los puertos son pequeños y específicos, como `CustomerDirectory.exists` (ISP). Los casos de uso dependen de interfaces, no de Sequelize ni de JWT (DIP), y por eso se prueban con dobles en memoria.
- **DRY:** `Email` y `Name` son compartidos por User y Customer. `crudRouter`, la paginación, el sobre de respuesta y el manejo de errores viven en `shared/`. Las búsquedas "o 404" están centralizadas (`findProductOrFail`, `findOrderOrFail`).
- **KISS:** inyección de dependencias manual, sin contenedores ni decoradores (el `tsconfig` los prohíbe con `erasableSyntaxOnly`).

## Base de datos

| Tabla         | Columnas                                                                                                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `users`       | `id` PK AI · `name` NOT NULL · `email` NOT NULL UNIQUE · `password` NOT NULL (hash bcrypt) · timestamps                                                                                                                  |
| `customers`   | `id` PK AI · `name` NOT NULL · `email` NOT NULL UNIQUE · timestamps                                                                                                                                                      |
| `products`    | `id` PK AI · `name` NOT NULL · `category` ENUM(`Electronics`,`Clothing`,`Books`) NOT NULL · `price` FLOAT NOT NULL · timestamps                                                                                          |
| `orders`      | `id` PK AI · `status` ENUM(`pending`,`processing`,`completed`,`declined`) NOT NULL DEFAULT `pending` · `total` FLOAT NULL · `shipping_address` TEXT NULL · `shipped_at` NULL · `customer_id` FK **CASCADE** · timestamps |
| `order_items` | `id` PK AI · `order_id` FK **CASCADE** · `product_id` FK **CASCADE** · `quantity` INT NOT NULL DEFAULT 1                                                                                                                 |

## Endpoints

Base: `http://localhost:3000/api`. Todas las rutas, salvo `/auth/*`, requieren `Authorization: Bearer <token>`.

| Método   | Ruta                                 | Descripción                                                                             | HU    |
| -------- | ------------------------------------ | --------------------------------------------------------------------------------------- | ----- |
| `POST`   | `/auth/register`                     | Registro → `{ token, user }`                                                            | HU-01 |
| `POST`   | `/auth/login`                        | Login → `{ token, user }`                                                               | HU-02 |
| `POST`   | `/customers`                         | Crea un cliente                                                                         | HU-03 |
| `GET`    | `/customers`                         | `?page` `?pageSize` `?name` (parcial) `?sort=asc\|desc` (fecha de creación)             | HU-04 |
| `GET`    | `/customers/:id`                     | Detalle de un cliente                                                                   |       |
| `PUT`    | `/customers/:id`                     | Reemplaza un cliente                                                                    | HU-05 |
| `PATCH`  | `/customers/:id`                     | Actualiza parcialmente un cliente                                                       | HU-05 |
| `DELETE` | `/customers/:id`                     | Elimina un cliente (y sus órdenes en cascada)                                           | HU-06 |
| `POST`   | `/products`                          | Crea un producto                                                                        | HU-07 |
| `GET`    | `/products`                          | `?category=Electronics\|Clothing\|Books` `?sort=asc\|desc` (precio) `?page` `?pageSize` | HU-08 |
| `GET`    | `/products/:id`                      | Detalle de un producto                                                                  |       |
| `PUT`    | `/products/:id`                      | Reemplaza un producto                                                                   |       |
| `PATCH`  | `/products/:id`                      | Actualiza parcialmente un producto                                                      |       |
| `DELETE` | `/products/:id`                      | Elimina un producto                                                                     |       |
| `GET`    | `/products/:id/qr`                   | Imagen del QR (`?format=png` por defecto, o `svg`)                                      | HU-12 |
| `POST`   | `/orders`                            | Crea una orden `{ customerId, shippingAddress?, items: [{ productId, quantity }] }`     | HU-09 |
| `GET`    | `/orders`                            | Listado paginado (`?customerId` `?status`)                                              |       |
| `GET`    | `/orders/:id`                        | Detalle de una orden                                                                    |       |
| `PATCH`  | `/orders/:id`                        | Cambia `status` (según transiciones) y/o `shippingAddress`                              |       |
| `DELETE` | `/orders/:id`                        | Elimina una orden                                                                       |       |
| `GET`    | `/customers/:customerId/orders`      | Historial con productos, cantidades, precios y subtotales                               | HU-10 |
| `GET`    | `/customers/:customerId/total-spent` | Total gastado por el cliente                                                            | HU-11 |

Ejemplo de orden (HU-10):

```json
{
  "id": 1,
  "customerId": 1,
  "status": "completed",
  "shippingAddress": "Av. Siempre Viva 100, Lima",
  "shippedAt": "2026-09-22T00:00:00.000Z",
  "items": [
    {
      "productId": 1,
      "productName": "Laptop Pro 14\"",
      "unitPrice": 1299.99,
      "quantity": 1,
      "subtotal": 1299.99
    },
    {
      "productId": 2,
      "productName": "Auriculares inalámbricos",
      "unitPrice": 89.9,
      "quantity": 2,
      "subtotal": 179.8
    }
  ],
  "total": 1479.79
}
```

Total gastado (HU-11): `{ "customerId": 1, "ordersCount": 3, "totalSpent": 1656.9 }`

## Decisiones de diseño

- **HU-11, total gastado:** `CalculateTotalSpentByCustomer` recorre las órdenes del cliente. Por cada una, `Order.total()` multiplica el precio unitario de cada producto por su cantidad (`OrderItem.subtotal()`), y el caso de uso suma los totales. Los importes se redondean a 2 decimales para evitar errores de coma flotante.
- **Precio unitario:** la tabla `order_items` del enunciado no guarda precio, así que el precio unitario es el del producto. `orders.total` se rellena al crear la orden como registro histórico.
- **HU-12, código QR:** el QR codifica directamente los datos del producto (id, nombre, categoría y precio). Al escanearlo con cualquier lector se ven los datos sin conexión y sin exponer una ruta pública, así que se cumple que _todas las rutas estén protegidas_.
- **Estados de la orden:** en minúsculas (`pending` por defecto), como indica la lista de valores del enunciado. Transiciones: `pending → processing | declined` y `processing → completed | declined`; `completed` y `declined` son finales. Al completarse se registra `shipped_at`.
- **Nombres del enunciado:** se respetan las carpetas y archivos pedidos. La única excepción es `EloquentProductRepository` (Eloquent es el ORM de Laravel), que se llama `SequelizeProductRepository` por coherencia con el ORM usado. Se añaden `Models/`, `Adapters/` y `Middleware/` en infraestructura para las implementaciones concretas.
- **Validación en dos niveles:** los `Validators/` (Zod) comprueban la forma de la petición (tipos y obligatorios), y las reglas de negocio viven en los _value objects_ del dominio.
