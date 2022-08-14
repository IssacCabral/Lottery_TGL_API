import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import { GameFactory, UserFactory, RoleAdminFactory } from 'Database/factories'

test.group('Games delete', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return (() => Database.rollbackGlobalTransaction())
  })

  test('user must be logged in before delete a game', async ({ client }) => {
    const game = await GameFactory.query().create()

    const response = await client.delete('/lottery/api/games/' + game.secureId)

    response.assertStatus(401)
    response.assertBodyContains({
      errors: [
        { message: 'E_UNAUTHORIZED_ACCESS: Unauthorized access' }
      ]
    })
  })

  test('user logged must be admin before delete a game', async ({ client }) => {
    const game = await GameFactory.query().create()
    const user = await UserFactory.query().create()

    const response = await client.delete('/lottery/api/games/' + game.secureId).loginAs(user)

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
    const response = await client.delete('/lottery/api/games/' + gameFakeSecureId).loginAs(user)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'game not found',
      originalError: 'E_ROW_NOT_FOUND: Row not found'
    })
  })

  test('delete game by secureId', async ({ client }) => {
    const user = await UserFactory.query().create()
    const roleAdmin = await RoleAdminFactory.query().create()

    await user.related('roles').attach([roleAdmin.id])

    const game = await GameFactory.query().create()
    const response = await client.delete('/lottery/api/games/' + game.secureId).loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Game successfully deleted'
    })
    
  })

})
