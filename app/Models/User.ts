import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeSave, column, HasMany, hasMany, ManyToMany, manyToMany, afterCreate } from '@ioc:Adonis/Lucid/Orm'

import Hash from '@ioc:Adonis/Core/Hash'
import Role from './Role'
import { v4 as uuidv4 } from 'uuid'

import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { compose } from '@ioc:Adonis/Core/Helpers'
import UserFilter from './Filters/UserFilter'

import Bet from './Bet'

import Producer from '../../kafka/Producer'

export default class User extends compose(BaseModel, Filterable) {
  public static $filter = () => UserFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public secureId: string

  @column({ serializeAs: null })
  public rememberMeToken?: string | null

  @column.dateTime({ serializeAs: null })
  public tokenCreatedAt?: DateTime | null

  @column()
  public name: string

  @column()
  public cpf: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column.dateTime({ serializeAs: null })
  public lastBet: DateTime | null

  @manyToMany(() => Role, {
    pivotTable: 'user_roles'
  })
  public roles: ManyToMany<typeof Role>

  @hasMany(() => Bet)
  public bets: HasMany<typeof Bet>

  @beforeCreate()
  public static assignUUID(user: User) {
    user.secureId = uuidv4()
  }

  @afterCreate()
  public static async sendWelcomeMail(user: User) {
    const producer = new Producer()

    await producer.connect()

    await producer.sendMessage([{
      value: JSON.stringify({
        name: user.name,
        email: user.email
      })
    }], 'welcome-email')

    await producer.disconnect()
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
