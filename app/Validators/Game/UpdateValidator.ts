import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesCustom from '../MessagesCustom'

export default class UpdateValidator extends MessagesCustom{
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public refs = schema.refs({
    gameSecureId: this.ctx.params.id,
  })

  public schema = schema.create({
    type: schema.string.optional({trim: true}, [
      rules.maxLength(22),
      rules.minLength(3),
      rules.unique({
        table: 'games', 
        column: 'type',
        whereNot: {secure_id: this.refs.gameSecureId}
      })
    ]),

    description: schema.string.optional({trim: true}, [
      rules.maxLength(200),
      rules.minLength(3)
    ]),

    range: schema.number.optional([rules.unsigned()]),
    price: schema.number.optional([rules.unsigned()]),

    // validar para ser menor que o range
    minAndMaxNumber: schema.number.optional([
      rules.unsigned(),
    ]),

    color: schema.string.optional({trim: true}, [
      rules.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    ])
  })


}
