import type { AddressInfo } from 'node:net'
import { after, before } from 'node:test'
import { createApp } from '../../src/app.ts'
import { sequelize } from '../../src/shared/database/sequelize.ts'

type RequestOptions = { body?: unknown; token?: string }

export type ApiResult<T = any> = { status: number; body: T }

/**
 * Levanta la app en un puerto libre durante la suite y devuelve un cliente HTTP mínimo.
 * Usa la base de datos configurada en `.env` (debe estar migrada).
 */
export function useTestServer() {
  let baseUrl = ''
  let close = () => {}

  before(async () => {
    const server = createApp().listen(0)
    await new Promise((resolve) => server.once('listening', resolve))
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api`
    close = () => server.close()
  })

  after(async () => {
    close()
    await sequelize.close()
  })

  async function request<T = any>(
    method: string,
    path: string,
    { body, token }: RequestOptions = {},
  ): Promise<ApiResult<T>> {
    const response = await fetch(baseUrl + path, {
      method,
      headers: {
        ...(body !== undefined && { 'content-type': 'application/json' }),
        ...(token && { authorization: `Bearer ${token}` }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    const text = await response.text()
    return { status: response.status, body: text ? JSON.parse(text) : null }
  }

  return {
    get: <T = any>(path: string, options?: RequestOptions) => request<T>('GET', path, options),
    post: <T = any>(path: string, body?: unknown, options?: RequestOptions) =>
      request<T>('POST', path, { ...options, body }),
    put: <T = any>(path: string, body?: unknown, options?: RequestOptions) =>
      request<T>('PUT', path, { ...options, body }),
    patch: <T = any>(path: string, body?: unknown, options?: RequestOptions) =>
      request<T>('PATCH', path, { ...options, body }),
    delete: <T = any>(path: string, options?: RequestOptions) =>
      request<T>('DELETE', path, options),
  }
}

/** Sufijo único para evitar colisiones entre ejecuciones (emails, nombres…). */
export const unique = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`
