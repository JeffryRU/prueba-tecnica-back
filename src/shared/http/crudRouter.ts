import { Router, type RequestHandler } from 'express'

/** Controlador con las acciones REST estándar de un recurso. */
export type CrudController = Record<
  'list' | 'show' | 'create' | 'replace' | 'update' | 'remove',
  RequestHandler
>

/** Registra las rutas REST de un recurso: GET / · GET /:id · POST / · PUT /:id · PATCH /:id · DELETE /:id */
export function crudRouter(controller: CrudController) {
  return Router()
    .get('/', controller.list)
    .get('/:id', controller.show)
    .post('/', controller.create)
    .put('/:id', controller.replace)
    .patch('/:id', controller.update)
    .delete('/:id', controller.remove)
}
