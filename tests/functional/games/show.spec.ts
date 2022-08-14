import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import { GameFactory, UserFactory } from 'Database/factories'

test.group('Games show', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return (() => Database.rollbackGlobalTransaction())
  })

  test('user must be logged in before showing a game', async ({client}) => {
    const game = await GameFactory.query().create()

    const response = await client.get('/lottery/api/games/' + game.secureId)

    response.assertStatus(401)
    response.assertBodyContains({
      errors: [
        { message: 'E_UNAUTHORIZED_ACCESS: Unauthorized access' }
      ]
    })
  })

  test('user logged must be admin before showing a game', async ({client}) => {
    const game = await GameFactory.query().create()
    const user = await UserFactory.query().create()

    const response = await client.get('/lottery/api/games/' + game.secureId).loginAs(user)

    response.assertStatus(403)
    response.assertBodyContains({
      message: "your user aren't authorized"
    })
    
  })

})
