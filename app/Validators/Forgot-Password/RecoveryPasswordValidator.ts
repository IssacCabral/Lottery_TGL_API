import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import MessagesCustom from '../MessagesCustom'

export default class RecoveryPasswordValidator extends MessagesCustom{
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    token: schema.string({trim: true}, [
      rules.exists({table: 'users', column: 'remember_me_token'})
    ]),
    password: schema.string({}, [rules.maxLength(50)])
  })

}
