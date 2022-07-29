import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import MessagesCustom from '../MessagesCustom'

export default class StoreValidator extends MessagesCustom{
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public refs = schema.refs({
    range: this.ctx.request.only(['range'])
  })

  public schema = schema.create({
    type: schema.string({trim: true}, [
      rules.maxLength(22),
      rules.minLength(3),
      rules.unique({
        table: 'games', 
        column: 'type'
      })
    ]),

    description: schema.string({trim: true}, [
      rules.maxLength(200),
      rules.minLength(3)
    ]),

    range: schema.number([
      rules.unsigned()
    ]),
    price: schema.number([rules.unsigned()]),

    // validar para ser menor que o range
    minAndMaxNumber: schema.number([
      rules.unsigned(),
    ]),

    color: schema.string({trim: true}, [
      rules.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    ]),


  })

  
}
