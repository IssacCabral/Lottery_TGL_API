import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import MessagesCustom from '../MessagesCustom'

export default class StoreValidator extends MessagesCustom{
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    name: schema.string({trim: true}, [
      rules.maxLength(50),
      rules.minLength(3),
      rules.regex(/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g)
    ]),
    cpf: schema.string([
      rules.regex(/^\d{3}.\d{3}.\d{3}-\d{2}$/),
      rules.unique({table: 'users', column: 'cpf'})
    ]),
    email: schema.string({trim: true}, [
      rules.maxLength(50),
      rules.minLength(8),
      rules.email(),
      rules.unique({table: 'users', column: 'email'})
    ]),
    
    password: schema.string({}, [rules.maxLength(50)])
  })


}
