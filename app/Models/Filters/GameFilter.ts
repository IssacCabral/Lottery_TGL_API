import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Game from 'App/Models/Game'

export default class GameFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Game, Game>

  type(value: string){
    this.$query.where('type', 'LIKE', `%${value}%`)
  }

  description(value: string){
    this.$query.where('description', 'LIKE', `%${value}%`)
  }

  color(value: string){
    this.$query.where('color', 'LIKE', `%${value}%`)
  }

  minAndMaxNumber(value: number){
    this.$query.where('mind_and_max_number', 'LIKE', `%${value}%`)
  }
}
