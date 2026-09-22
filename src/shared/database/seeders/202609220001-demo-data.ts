import bcrypt from 'bcryptjs'
import type { Migration } from '../umzug.ts'

/** Credenciales del usuario de ejemplo. */
export const DEMO_USER = { email: 'admin@example.com', password: 'Password123!' }

const customers = [
  'Lucía Fernández',
  'Mateo Gómez',
  'Valentina Ruiz',
  'Santiago Castro',
  'Camila Morales',
  'Diego Herrera',
  'Sofía Vargas',
  'Joaquín Ramírez',
  'Isabella Chávez',
  'Tomás Mendoza',
  'Martina Silva',
  'Nicolás Rojas',
]

const products = [
  { name: 'Laptop Pro 14"', category: 'Electronics', price: 1299.99 },
  { name: 'Auriculares inalámbricos', category: 'Electronics', price: 89.9 },
  { name: 'Monitor 27" 4K', category: 'Electronics', price: 349.5 },
  { name: 'Teclado mecánico', category: 'Electronics', price: 74.99 },
  { name: 'Camiseta de algodón', category: 'Clothing', price: 15.99 },
  { name: 'Chaqueta impermeable', category: 'Clothing', price: 79.9 },
  { name: 'Zapatillas running', category: 'Clothing', price: 110 },
  { name: 'Jeans slim fit', category: 'Clothing', price: 45.5 },
  { name: 'Clean Code', category: 'Books', price: 32.9 },
  { name: 'Domain-Driven Design', category: 'Books', price: 54.99 },
  { name: 'Refactoring', category: 'Books', price: 41.25 },
  { name: 'The Pragmatic Programmer', category: 'Books', price: 38 },
]

/** [cliente, estado, [[producto, cantidad], …]] */
const orders: [number, string, [number, number][]][] = [
  [
    1,
    'completed',
    [
      [1, 1],
      [2, 2],
    ],
  ],
  [
    1,
    'processing',
    [
      [9, 1],
      [10, 1],
      [11, 1],
    ],
  ],
  [1, 'pending', [[5, 3]]],
  [
    2,
    'completed',
    [
      [3, 2],
      [4, 1],
    ],
  ],
  [2, 'declined', [[7, 1]]],
  [
    3,
    'pending',
    [
      [6, 1],
      [8, 2],
    ],
  ],
  [
    4,
    'completed',
    [
      [12, 2],
      [9, 1],
    ],
  ],
  [
    5,
    'processing',
    [
      [2, 1],
      [5, 2],
      [6, 1],
    ],
  ],
]

export const up: Migration = async ({ context: queryInterface }) => {
  const now = Date.now()
  const at = (hoursAgo: number) => new Date(now - hoursAgo * 3_600_000)

  await queryInterface.bulkInsert('users', [
    {
      id: 1,
      name: 'Administrador',
      email: DEMO_USER.email,
      password: await bcrypt.hash(DEMO_USER.password, 10),
      created_at: at(0),
      updated_at: at(0),
    },
  ])

  await queryInterface.bulkInsert(
    'customers',
    customers.map((name, index) => ({
      id: index + 1,
      name,
      email: `${name.split(' ')[0]!.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()}@example.com`,
      created_at: at((customers.length - index) * 24),
      updated_at: at((customers.length - index) * 24),
    })),
  )

  await queryInterface.bulkInsert(
    'products',
    products.map((product, index) => ({
      id: index + 1,
      ...product,
      created_at: at(0),
      updated_at: at(0),
    })),
  )

  const priceOf = (productId: number) => products[productId - 1]!.price
  await queryInterface.bulkInsert(
    'orders',
    orders.map(([customerId, status, items], index) => ({
      id: index + 1,
      customer_id: customerId,
      status,
      total: Math.round(items.reduce((sum, [p, q]) => sum + priceOf(p) * q, 0) * 100) / 100,
      shipping_address: `Av. Siempre Viva ${100 + index}, Lima`,
      shipped_at: status === 'completed' ? at(orders.length - index) : null,
      created_at: at((orders.length - index) * 12),
      updated_at: at((orders.length - index) * 12),
    })),
  )

  await queryInterface.bulkInsert(
    'order_items',
    orders.flatMap(([, , items], index) =>
      items.map(([productId, quantity]) => ({
        order_id: index + 1,
        product_id: productId,
        quantity,
      })),
    ),
  )
}

export const down: Migration = async ({ context: queryInterface }) => {
  for (const table of ['order_items', 'orders', 'products', 'customers', 'users']) {
    await queryInterface.bulkDelete(table, {})
  }
}
