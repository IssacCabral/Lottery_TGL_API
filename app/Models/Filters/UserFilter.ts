import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class UserFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof User, User>

  name(value: string){
    this.$query.where('name', 'LIKE', `%${value}%`)
  }

  cpf(value: string){
    this.$query.where('cpf', 'LIKE', `%${value}%`)
  }

  email(value: string){
    this.$query.where('email', 'LIKE', `%${value}%`)
  }

}
