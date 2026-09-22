import { dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import type { QueryInterface } from 'sequelize'
import { SequelizeStorage, Umzug } from 'umzug'
import { sequelize } from './sequelize.ts'

type Step = {
  up: (params: { context: QueryInterface }) => Promise<unknown>
  down?: (params: { context: QueryInterface }) => Promise<unknown>
}

const cwd = dirname(fileURLToPath(import.meta.url))

/**
 * Crea un runner de Umzug para una carpeta de archivos `.ts` que exportan `up` / `down`.
 * Los archivos se importan como módulos ESM, así que Node los ejecuta sin compilar.
 */
function createRunner(folder: string, modelName: string) {
  return new Umzug<QueryInterface>({
    migrations: {
      glob: [`${folder}/*.ts`, { cwd }],
      resolve: ({ name, path, context }) => {
        const load = async (): Promise<Step> => import(pathToFileURL(path!).href)
        return {
          name,
          up: async () => (await load()).up({ context }),
          down: async () => (await load()).down?.({ context }),
        }
      },
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize, modelName }),
    logger: console,
  })
}

export const migrator = createRunner('migrations', 'SequelizeMeta')
export const seeder = createRunner('seeders', 'SequelizeData')

export type Migration = typeof migrator._types.migration
