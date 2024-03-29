import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

import StoreValidator from 'App/Validators/User/StoreValidator'
import UpdateValidator from 'App/Validators/User/UpdateValidator'

import User from 'App/Models/User'
import Role from 'App/Models/Role'

import { sendNewUserEmail } from 'App/services/sendEmail'

import moment from 'moment'
import { DateTime } from 'luxon'
import Game from 'App/Models/Game'

import Producer from '../../../kafka/Producer'

export default class UsersController {

  public async store({ request, response }: HttpContextContract) {
    await request.validate(StoreValidator)

    const userBody = request.only(['name', 'cpf', 'email', 'password'])

    let user = new User()

    const trx = await Database.transaction()

    try {
      user.fill(userBody)

      user.useTransaction(trx)

      await user.save()

      const playerRole = await Role.findByOrFail('name', 'player')

      if (playerRole) {
        await user.related('roles').attach([playerRole.id])
      }
    } catch (error) {
      trx.rollback()
      return response.badRequest({ message: 'error in create user', originalError: error.message })
    }

    await trx.commit()

    let createdUser
    try {
      createdUser = await User.query().where('id', user.id).preload('roles').firstOrFail()
    } catch (error) {
      return response.notFound({ message: 'error in find the created user', originalError: error.message })
    }

    response.ok({ createdUser })
  }

  public async show({ auth, response, params }: HttpContextContract) {
    const userSecureId = params.id

    try {
      const checkId = auth.user?.secureId == userSecureId

      if (!checkId) {
        return response.forbidden({ message: 'You don/\t have permissions to show other user' })
      }

      const searchUser = await User.query()
        .where('secure_id', userSecureId)
        .preload('roles')
        .preload('bets')
        .firstOrFail()

      const lastMonthBets: any = []
      let lastMonthBetsPrice: number = 0

      await Promise.all(
        searchUser?.bets.map(async (bet) => {
          const betYear = bet.createdAt.year
          const betMonth = bet.createdAt.month
          const betDay = bet.createdAt.day

          const { year, month, day } = DateTime.now()

          const expiredBet = moment(new Date(year, month, day), "YYYY-MM-DD").subtract(30, 'days').isAfter(new Date(betYear, betMonth, betDay))

          if (!expiredBet) {
            // carregar o game para pegar o preço
            const game = await Game.findBy('id', bet.gameId)
            lastMonthBetsPrice += game!.price

            const betJSON = bet.serialize()
            lastMonthBets.push(betJSON)
          }

        })
      )

      const userJSON = searchUser!.serialize()

      delete userJSON.bets

      userJSON.lastMonthBetsPrice = lastMonthBetsPrice
      userJSON.lastMonthBets = lastMonthBets

      return response.ok({ userJSON })
    } catch (error) {
      return response.notFound({ message: 'user not found', originalError: error.message })
    }

  }

  public async update({ auth, request, response, params }: HttpContextContract) {
    await request.validate(UpdateValidator)

    const userBody = request.only(['name', 'cpf', 'email', 'password'])
    const secureId = params.id

    let user = new User()

    const trx = await Database.transaction()

    try {
      const checkId = auth.user?.secureId == secureId

      if (!checkId) {
        return response.forbidden({ message: 'You don/\t have permissions to update other user' })
      }

      user = await User.findByOrFail('secure_id', secureId)

      user.useTransaction(trx)

      await user.merge(userBody).save()

    } catch (error) {
      trx.rollback()
      return response.badRequest({ message: 'error in update user', originalError: error.message })
    }

    trx.commit()

    let updatedUser
    try {
      updatedUser = await User.query().where('id', user.id).preload('roles')
    } catch (error) {
      return response.notFound({ message: 'error in find the updated user', originalError: error.message })
    }

    response.ok({ updatedUser })
  }

}
