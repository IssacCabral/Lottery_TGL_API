import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Bet from 'App/Models/Bet'
import Cart from 'App/Models/Cart'
import StoreValidator from 'App/Validators/Bet/StoreValidator'

import ValidateBetNUmbers from 'App/utils/ValidateBetNumbers'
import User from 'App/Models/User'

export default class BetsController {
  public async index({ }: HttpContextContract) {

  }

  public async store({ request, response, auth }: HttpContextContract) {
    const {bets} = await request.validate(StoreValidator)

    const cart = await Cart.query().firstOrFail()
    const {errors, betsToCreate} = await ValidateBetNUmbers(bets, cart.minCartValue)

    if (errors.length > 0) {
      return response.badRequest(errors)
    }

    betsToCreate.map(async (bet) => {
      try{
        const betToCreate = new Bet()

        betToCreate.fill({
          userId: auth.user!.id,
          gameId: bet.gameId,
          numbers: bet.numbers
        })

        await betToCreate.save()
      } catch(error){
        return response.badRequest({
          message: `error in create the bet ${bet}`, 
          originalError: error.message
        })
      }
      
    })

    try{
      return await User.query().where('id', auth.user!.id).preload('bets').firstOrFail()
    } catch(error){
      return response.notFound({message: 'user not found', originalError: error.message})
    }

  }

  public async show({ }: HttpContextContract) {

  }

}
