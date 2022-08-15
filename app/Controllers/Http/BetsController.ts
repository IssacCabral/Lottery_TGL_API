import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Bet from 'App/Models/Bet'
import Cart from 'App/Models/Cart'
import StoreValidator from 'App/Validators/Bet/StoreValidator'

import ValidateBetNUmbers from 'App/utils/ValidateBetNumbers'
import User from 'App/Models/User'

import { sendNewBetEmail } from 'App/services/sendEmail'

import { DateTime } from 'luxon'
import GetGamesInformation from 'App/utils/GetGamesInformation'

export default class BetsController {

  public async index({ request, response, auth }: HttpContextContract) {
    const { page, limit, noPaginate } = request.qs()

    if (noPaginate) {
      return await Bet.query().where('user_id', auth.user!.id)
    }

    try {
      const userBets = await Bet.query()
        .paginate(page || 1, limit || 10)

      return response.ok({ userBets })
    } catch (error) {
      return response.badRequest({ message: 'error in list user bets', originalError: error.message })
    }

  }

  public async store({ request, response, auth }: HttpContextContract) {
    const { bets } = await request.validate(StoreValidator)

    const cart = await Cart.query().firstOrFail()
    const { errors, betsToCreate, cartTotalValue } = await ValidateBetNUmbers(bets, cart.minCartValue)
    //let betsCreatedIds: number[] = []
    let betsCreatedAt
    if (errors.length > 0) {
      return response.badRequest(errors)
    }

    const gamesInformation = await GetGamesInformation(betsToCreate)

    await Promise.all(
      betsToCreate.map(async (bet) => {
        try {
          const betToCreate = new Bet()

          betToCreate.fill({
            userId: auth.user!.id,
            gameId: bet.gameId,
            numbers: bet.numbers
          })

          await betToCreate.save()
          //betsCreatedIds.push(betToCreate.id)
          betsCreatedAt = betToCreate.createdAt
        } catch (error) {
          return response.badRequest({
            message: `error in create the bet ${bet}`,
            originalError: error.message
          })
        }

      })
    )

    try {
      const user = await User.query().where('id', auth.user!.id).firstOrFail()
      user!.lastBet = DateTime.now()
      await user!.save()
    } catch (error) {
      return response.badRequest({ message: 'error in set lastBet date', originalError: error.message })
    }

    try {
      const user = await User.query().where('id', auth.user!.id).preload('bets').firstOrFail()

      await sendNewBetEmail(user, 'mail/new_bet', cartTotalValue, gamesInformation)
    } catch (error) {
      return response.status(500).send({ message: 'error in send welcome email', originalError: error.message })
    }

    try {
      const {year, month, day, hour, minute, second} = betsCreatedAt

      let userFinded = await User.query()
        .where('id', auth.user!.id)
        .preload('bets', (betQuery) => {
          betQuery.where('created_at', `${year}-${month}-${day}-${hour}-${minute}-${second}`)
        }).firstOrFail()
      
      let userFindedJSON = userFinded.serialize()

      delete userFindedJSON.bets
      
      userFindedJSON.lastBetsPrice = cartTotalValue
      userFindedJSON.lastBets = userFinded.bets.map((bet) => {
        return bet.serialize()
      })

      return response.created({user: userFindedJSON})
    } catch (error) {
      return response.notFound({ message: 'user not found', originalError: error.message })
    }

  }

  public async show({ response, auth, params }: HttpContextContract) {
    const betId = params.id
    const userId = auth.user!.id

    let bet
    try {
      bet = await Bet.findByOrFail('id', betId)
    } catch (error) {
      return response.notFound({ message: 'bet not found', originalError: error.message })
    }

    if (bet.userId !== userId) {
      return response.forbidden({ message: 'You don/\t have permissions to show other user bet' })
    }

    const userBet = await Bet.query()
      .where('id', betId)
      .andWhere('user_id', userId)
      .preload('game')

    return response.ok({ userBet })
  }

}
