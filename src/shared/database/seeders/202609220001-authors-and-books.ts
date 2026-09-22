import type { Migration } from '../umzug.ts'

const now = new Date()

const authors = [
  { id: 1, name: 'Gabriel García Márquez', email: 'gabo@example.com' },
  { id: 2, name: 'Isabel Allende', email: 'isabel.allende@example.com' },
  { id: 3, name: 'Mario Vargas Llosa', email: 'mario.vargas@example.com' },
  { id: 4, name: 'Julio Cortázar', email: 'julio.cortazar@example.com' },
]

const books = [
  {
    title: 'Cien años de soledad',
    description: 'La historia de la familia Buendía en Macondo.',
    price: 59.9,
    author_id: 1,
  },
  {
    title: 'El amor en los tiempos del cólera',
    description: 'Un amor que espera más de medio siglo.',
    price: 49.5,
    author_id: 1,
  },
  {
    title: 'Crónica de una muerte anunciada',
    description: 'Un crimen que todo el pueblo sabía que ocurriría.',
    price: 35,
    author_id: 1,
  },
  {
    title: 'La casa de los espíritus',
    description: 'Saga de la familia Trueba a lo largo de cuatro generaciones.',
    price: 54.9,
    author_id: 2,
  },
  {
    title: 'Paula',
    description: 'Memorias escritas junto a la cama de su hija.',
    price: 42,
    author_id: 2,
  },
  {
    title: 'La ciudad y los perros',
    description: 'La vida de los cadetes del colegio militar Leoncio Prado.',
    price: 47.9,
    author_id: 3,
  },
  {
    title: 'Conversación en La Catedral',
    description: '¿En qué momento se había jodido el Perú?',
    price: 62.5,
    author_id: 3,
  },
  {
    title: 'Rayuela',
    description: 'Una novela que puede leerse en más de un orden.',
    price: 55,
    author_id: 4,
  },
  {
    title: 'Bestiario',
    description: 'Primer libro de cuentos del autor.',
    price: 29.9,
    author_id: 4,
  },
]

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.bulkInsert(
    'authors',
    authors.map((author) => ({ ...author, created_at: now, updated_at: now })),
  )
  await queryInterface.bulkInsert(
    'books',
    books.map((book) => ({ ...book, created_at: now, updated_at: now })),
  )
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.bulkDelete('books', {})
  await queryInterface.bulkDelete('authors', {})
}
