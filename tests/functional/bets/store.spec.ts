import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import { RolePlayerFactory, UserFactory, CartFactory, GameFactory, QuinaFactory, LotoFacilFactory, MegaSenaFactory } from 'Database/factories'
import randomBet from '../../utils/random-bet'

test.group('Bets store', (group) => {
  group.tap((test) => test.tags(['@bets_store']))
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return (() => Database.rollbackGlobalTransaction())
  })

  test('user must be logged in before create a bet', async ({client}) => {
    const response = await client.post('/lottery/api/bets')

    response.assertStatus(401)
    response.assertStatus(401)
    response.assertBodyContains({
      errors: [
        { message: 'E_UNAUTHORIZED_ACCESS: Unauthorized access' }
      ]
    })
  })

  test('user logged must be player before create a bet', async ({client}) => {
    const user = await UserFactory.query().create()
    const response = await client.post('/lottery/api/bets').loginAs(user)

    response.assertStatus(403)
    response.assertBodyContains({
      message: "your user aren't authorized"
    })
  })

  test('make sure bet attributes is provided', async ({client}) => {
    const user = await UserFactory.query().create()
    const rolePlayer = await RolePlayerFactory.query().create()

    await user.related('roles').attach([rolePlayer.id])

    const response = await client.post('/lottery/api/bets').loginAs(user)

    response.assertStatus(422)
    response.assertBodyContains({
      "errors": [
        {
          "rule": "required",
          "field": "bets",
          "message": "bets field is required"
        }
      ]
    })
  })

  test('make sure game exists before create a bet', async ({client}) => {
    const user = await UserFactory.query().create()
    const rolePlayer = await RolePlayerFactory.query().create()

    await user.related('roles').attach([rolePlayer.id])

    const response = await client.post('/lottery/api/bets').loginAs(user).form({
      bets: [
        {
          gameId: 1,
          numbers: [
            "01", "02", "03", "04", "05", "10", "13",
				    "14", "17", "20", "21", "18", "7", "9", "12"
          ]
        }
      ]
    })

    response.assertStatus(422)
    response.assertBodyContains({
      "errors": [
        {
          "rule": "exists",
          "field": "bets.0.gameId",
          "message": "bets.0.gameId not found in us database"
        }
      ]
    })

  })

  test('make sure cart sum is valid to minCartValue', async ({client}) => {
    const cart = await CartFactory.query().create()

    const user = await UserFactory.query().create()
    const rolePlayer = await RolePlayerFactory.query().create()

    await user.related('roles').attach([rolePlayer.id])

    const lotofacil = await LotoFacilFactory.query().create()
    const quina = await QuinaFactory.query().create()

    cart.minCartValue = 9.70
    await cart.save()

    const response = await client.post('/lottery/api/bets').loginAs(user).form({
      bets: [
        {
          gameId: lotofacil.id,
          numbers: [
            "01", "02", "03", "04", "05", "10", "13",
				    "14", "17", "20", "21", "18", "7", "9", "12"
          ]
        },
        {
          gameId: quina.id,
          numbers: [
            "01", "02", "03", "04", "05"
          ]
        },
      ]
    })

    response.assertStatus(400)
    response.assertBodyContains([
      {
        "message": "your cart must have a minimum value of R$9,70"
      }
    ])

  })

  test('make sure you pass the correct amount of numbers for a given game', async ({client}) => {
    const cart = await CartFactory.query().create()

    const user = await UserFactory.query().create()
    const rolePlayer = await RolePlayerFactory.query().create()

    await user.related('roles').attach([rolePlayer.id])

    const quina = await QuinaFactory.query().create()

    cart.minCartValue = 9.70
    await cart.save()

    const response = await client.post('/lottery/api/bets').loginAs(user).form({
      bets: [
        {
          gameId: quina.id,
          numbers: [
            "01", "02", "03", "04"
          ]
        },
      ]
    })

    response.assertStatus(400)
    response.assertBodyContains([
      {
        "message": "The Quina only allows 5 numbers choosen"
      }
    ])
  })

  test('ensure that an array of numbers is being passed in the request', async ({client}) => {
    const user = await UserFactory.query().create()
    const rolePlayer = await RolePlayerFactory.query().create()

    await user.related('roles').attach([rolePlayer.id])

    const game = await GameFactory.query().create()

    const response = await client.post('/lottery/api/bets').loginAs(user).form({
      bets: [
        {
          gameId: game.id
        },
      ]
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          rule: 'required',
          field: 'bets.0.numbers',
          message: 'bets.0.numbers field is required'
        }
      ]
    })
  })

  test('ensure the bets can be created when everything is fine', async ({client, assert}) => {
    const cart = await CartFactory.query().create()

    const user = await UserFactory.query().create()
    const rolePlayer = await RolePlayerFactory.query().create()

    await user.related('roles').attach([rolePlayer.id])

    const lotoFacil = await LotoFacilFactory.query().create()
    const megaSena = await MegaSenaFactory.query().create()
    const quina = await QuinaFactory.query().create()

    cart.minCartValue = 9.00
    await cart.save()

    const response = await client.post('/lottery/api/bets').loginAs(user).form({
      bets: [
        {
          "gameId": lotoFacil.id,
          "numbers": [
            "01", "02", "03", "04", "05", "10", "13",
            "14", "17", "20", "21", "18", "7", "9", "12"
          ]
        },
        {
          "gameId": megaSena.id,
          "numbers": [
            "01", "02", "09", "10", "17", "18"
          ]
        },
        {
          "gameId": quina.id,
          "numbers": [
            "01", "02", "03", "10", "17"
          ]
        }
      ]
    })

    response.assertStatus(201)
    assert.containsSubset(response.body().user, { "lastBets": [] })

  })

  test('ensure create new random bets', async ({client, assert}) => {
    const cart = await CartFactory.query().create()

    const user = await UserFactory.query().create()
    const rolePlayer = await RolePlayerFactory.query().create()

    await user.related('roles').attach([rolePlayer.id])

    const lotoFacil = await LotoFacilFactory.query().create()
    const megaSena = await MegaSenaFactory.query().create()
    const quina = await QuinaFactory.query().create()

    cart.minCartValue = 9.00
    await cart.save()

    const response = await client.post('/lottery/api/bets').loginAs(user).form({
      bets: [
        {
          "gameId": lotoFacil.id,
          "numbers": randomBet(15, 25)
        },
        {
          "gameId": megaSena.id,
          "numbers": randomBet(6, 60)
        },
        {
          "gameId": quina.id,
          "numbers": randomBet(5, 80)
        }
      ]
    })

    response.assertStatus(201)
    assert.containsSubset(response.body().user, {
      "lastBetsPrice": 9, 
      "lastBets": [] 
    })
  })  

})
