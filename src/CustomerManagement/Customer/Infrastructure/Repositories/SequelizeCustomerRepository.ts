import { Op } from 'sequelize'
import { buildPage, type Page } from '../../../../shared/domain/Pagination.ts'
import type { Email } from '../../../../shared/domain/ValueObjects/Email.ts'
import type { CustomerContract, CustomerCriteria } from '../../Domain/Contract/CustomerContract.ts'
import { Customer } from '../../Domain/Entities/Customer.ts'
import { CustomerModel } from '../Models/CustomerModel.ts'

const toDomain = (model: CustomerModel) => Customer.fromPrimitives(model.get({ plain: true }))

export class SequelizeCustomerRepository implements CustomerContract {
  async save(customer: Customer): Promise<Customer> {
    const { id, name, email } = customer.toPrimitives()
    if (id === null) return toDomain(await CustomerModel.create({ name, email }))

    await CustomerModel.update({ name, email }, { where: { id } })
    return toDomain((await CustomerModel.findByPk(id))!)
  }

  async findById(id: number) {
    const model = await CustomerModel.findByPk(id)
    return model && toDomain(model)
  }

  async findByEmail(email: Email) {
    const model = await CustomerModel.findOne({ where: { email: email.value } })
    return model && toDomain(model)
  }

  async search({ name, sort, page, pageSize }: CustomerCriteria): Promise<Page<Customer>> {
    const { rows, count } = await CustomerModel.findAndCountAll({
      where: name ? { name: { [Op.like]: `%${name}%` } } : {},
      order: [
        ['createdAt', sort],
        ['id', sort],
      ],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    })
    return buildPage(rows.map(toDomain), count, { page, pageSize })
  }

  async delete(id: number) {
    await CustomerModel.destroy({ where: { id } })
  }
}
