import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import MessagesCustom from '../MessagesCustom'

export default class StoreValidator extends MessagesCustom{
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    bets: schema
      .array([rules.minLength(1)])
      .members(schema.object().members({
        gameId: schema.number([rules.exists({table: 'games', column: 'id'})]),
        numbers: schema.array([rules.minLength(1)]).members(schema.string())
      }))
  })

}
