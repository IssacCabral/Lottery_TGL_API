import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import StoreValidator from 'App/Validators/Game/StoreValidator'
import UpdateValidator from 'App/Validators/Game/UpdateValidator'
import Game from 'App/Models/Game'

export default class GamesController {
  public async index({request, response}: HttpContextContract) {
    const {page, limit, noPaginate, ...inputs} = request.qs()

    if(noPaginate){
      return {types: await Game.query().filter(inputs)}
    }

    try{
      const games = await Game.query()
        .filter(inputs)
        .paginate(page || 1, limit || 10)

      return response.ok({types: games})
    } catch(error){
      return response.badRequest({ message: 'error in list games', originalError: error.message })
    }

  }

  public async store({request, response}: HttpContextContract) {
    const game = await request.validate(StoreValidator)

    const {range, minAndMaxNumber} = request.all()
    if(minAndMaxNumber >= range){
      return response.badRequest({message: 'range must be greater than minAndMaxNumber'})
    }

    try{
      return {game: await Game.create(game)}
    } catch(error){
      return response.status(400).send({message: 'error in create game', originalError: error.message})
    }
  }

  public async show({response, params}: HttpContextContract) {
    const gameSecureId = params.id
    
    try{
      return await Game.findByOrFail('secure_id', gameSecureId)
    } catch(error){
      return response.status(404).send({message: 'error in show the game', originalError: error.message})
    }
  }

  public async update({request, response, params}: HttpContextContract) {
    const game = await request.validate(UpdateValidator)

    const gameSecureId = params.id

    try{
      const gameUpdated = await Game.findByOrFail('secure_id', gameSecureId)

      await gameUpdated?.merge(game).save()

      return response.ok({gameUpdated})
    } catch(error){
      return response.status(400).send({message: 'error in update game', originalError: error.message})
    }

  }

  public async destroy({response, params}: HttpContextContract) {
    const gameSecureId = params.id

    try{
      const game = await Game.findByOrFail('secure_id', gameSecureId)

      await game.delete()

      return response.ok({message: 'Category successfully deleted'})
    } catch(error){
      return response.status(400).send({message: 'game not found', originalError: error.message})
    }
  }
}
