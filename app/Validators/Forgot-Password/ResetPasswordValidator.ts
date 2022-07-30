import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import MessagesCustom from '../MessagesCustom'

export default class ResetPasswordValidator extends MessagesCustom{
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    email: schema.string([
      rules.email(),
      rules.exists({table: 'users', column: 'email'})
    ])
  })

}
