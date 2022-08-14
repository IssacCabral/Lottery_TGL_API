import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import StoreValidator from 'App/Validators/Game/StoreValidator'
import UpdateValidator from 'App/Validators/Game/UpdateValidator'
import Game from 'App/Models/Game'

import Cart from 'App/Models/Cart'

export default class GamesController {
  public async index({request, response}: HttpContextContract) {
    const {page, per_page, noPaginate, ...inputs} = request.qs()
    const cart = await Cart.first()
    const minCartValue = cart?.minCartValue

    if(noPaginate){
      return {minCartValue, types: await Game.query().filter(inputs)}
    }

    try{
      const games = await Game.query()
        .filter(inputs)
        .orderBy('id', 'desc')
        .paginate(page || 1, per_page || 4)

      return response.ok({minCartValue, types: games})
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
      return response.created({game: await Game.create(game)}) 
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

      return response.ok({message: 'Game successfully deleted'})
    } catch(error){
      return response.status(404).send({message: 'game not found', originalError: error.message})
    }
  }
}
