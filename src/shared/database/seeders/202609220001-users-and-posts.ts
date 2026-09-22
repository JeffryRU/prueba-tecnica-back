import { bcryptPasswordHasher } from '../../../modules/auth/password.hasher.ts'
import type { Migration } from '../umzug.ts'

/** Contraseña de todos los usuarios de ejemplo. */
export const SEED_PASSWORD = 'Password123!'

const users = [
  { id: 1, name: 'Ana Torres', email: 'ana@example.com' },
  { id: 2, name: 'Bruno Díaz', email: 'bruno@example.com' },
  { id: 3, name: 'Carla Rojas', email: 'carla@example.com' },
]

const topics = [
  'Primeros pasos con Express 5',
  'Autenticación con JWT',
  'Paginación en APIs REST',
  'Migraciones con Sequelize',
  'Validación con Zod',
  'Manejo de errores centralizado',
  'Principios SOLID en Node.js',
  'Buenas prácticas con MySQL',
]

export const up: Migration = async ({ context: queryInterface }) => {
  const password = await bcryptPasswordHasher.hash(SEED_PASSWORD)
  const now = Date.now()

  await queryInterface.bulkInsert(
    'users',
    users.map((user) => ({
      ...user,
      password,
      created_at: new Date(now),
      updated_at: new Date(now),
    })),
  )

  // 24 posts repartidos entre los usuarios, con fechas escalonadas para probar el orden
  const posts = Array.from({ length: 24 }, (_, index) => {
    const createdAt = new Date(now - (24 - index) * 3_600_000)
    return {
      title: `${topics[index % topics.length]} (#${index + 1})`,
      content: `Contenido de ejemplo del post ${index + 1}.`,
      user_id: users[index % users.length]!.id,
      created_at: createdAt,
      updated_at: createdAt,
    }
  })
  await queryInterface.bulkInsert('posts', posts)
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.bulkDelete('posts', {})
  await queryInterface.bulkDelete('users', {})
}
