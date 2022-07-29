import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import MessagesCustom from '../MessagesCustom'

export default class SetUserRolesValidator extends MessagesCustom{
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    userId: schema.number([rules.unsigned()]),
    roles: schema
      .array([rules.minLength(1)])
      .members(schema.string({trim: true}, [rules.exists({table: 'roles', column: 'name'})]))
  })


}
