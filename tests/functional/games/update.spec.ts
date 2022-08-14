import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import { GameFactory, UserFactory, RoleAdminFactory } from 'Database/factories'

test.group('Games update', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return (() => Database.rollbackGlobalTransaction())
  })

  test('user must be logged in before update a game', async ({ client }) => {
    const game = await GameFactory.query().create()

    const response = await client.put('/lottery/api/games/' + game.secureId)

    response.assertStatus(401)
    response.assertBodyContains({
      errors: [
        { message: 'E_UNAUTHORIZED_ACCESS: Unauthorized access' }
      ]
    })
  })

  test('user logged must be admin before update a game', async ({ client }) => {
    const game = await GameFactory.query().create()
    const user = await UserFactory.query().create()

    const response = await client.put('/lottery/api/games/' + game.secureId).loginAs(user)

    response.assertStatus(403)
    response.assertBodyContains({
      message: "your user aren't authorized"
    })
  })

  test('return 404 when gameSecureId does not exists', async ({ client }) => {
    const user = await UserFactory.query().create()
    const roleAdmin = await RoleAdminFactory.query().create()

    await user.related('roles').attach([roleAdmin.id])

    const gameFakeSecureId = '825cb4b9-77c3-46cb-adde-ec05f52d77c4'
    const response = await client.put('/lottery/api/games/' + gameFakeSecureId).loginAs(user)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'error in update game',
      originalError: 'E_ROW_NOT_FOUND: Row not found'
    })
  })

  test('ensure update when user is authenticated', async ({ client, assert }) => {
    const user = await UserFactory.query().create()
    const roleAdmin = await RoleAdminFactory.query().create()

    await user.related('roles').attach([roleAdmin.id])

    const gameCreated = await client.post('/lottery/api/games').loginAs(user).form({
      type: "Quina",
      description: "Escolha 5 números dos 80 disponíveis na quina. 5, 4, 3 ou 2 acertos. São seis sorteios semanais e seis chances de ganhar.",
      range: 80,
      price: 2,
      minAndMaxNumber: 5,
      color: "#F79C31",
    })

    const response = await client.put('/lottery/api/games/' + gameCreated.body().game.secure_id).loginAs(user).form({
      type: "Quina Mania",
      description: "Escolha 5 números dos 80 disponíveis na quina. 5, 4, 3 ou 2 acertos. São seis sorteios semanais e seis chances de ganhar.",
      range: 80,
      price: 2,
      minAndMaxNumber: 5,
      color: "#FFFFFF",
    })

    response.assertStatus(200)
    assert.containsSubset(response.body(), {
      gameUpdated: {
        type: "Quina Mania",
        description: "Escolha 5 números dos 80 disponíveis na quina. 5, 4, 3 ou 2 acertos. São seis sorteios semanais e seis chances de ganhar.",
        range: 80,
        price: 2,
        min_and_max_number: 5,
        color: "#FFFFFF",
      }
    })
  })

  
})
