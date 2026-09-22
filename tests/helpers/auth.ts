import { unique } from './testServer.ts'

type Api = { post: (path: string, body?: unknown) => Promise<{ body: any }> }

/** Registra un usuario nuevo y devuelve su token. */
export async function registerAndGetToken(api: Api): Promise<string> {
  const res = await api.post('/auth/register', {
    name: 'Tester',
    email: `tester.${unique()}@example.com`,
    password: 'Secreta#2026',
  })
  return res.body.data.token
}
