import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm'

import {v4 as uuidv4} from 'uuid'

import {Filterable} from '@ioc:Adonis/Addons/LucidFilter'
import {compose} from '@ioc:Adonis/Core/Helpers'
import GameFilter from './Filters/GameFilter'

export default class Game extends compose(BaseModel, Filterable) {
  public static $filter = () => GameFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public secureId: string

  @column()
  public type: string

  @column()
  public description: string

  @column()
  public range: number

  @column()
  public price: number

  @column()
  public minAndMaxNumber: number

  @column()
  public color: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUUID(game: Game){
    game.secureId = uuidv4()
  }
}
