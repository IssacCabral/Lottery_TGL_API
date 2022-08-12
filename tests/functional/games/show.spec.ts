import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Games show', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return (() => Database.rollbackGlobalTransaction())
  })

  test('return empty list when there are no games', async ({client}) => {
    const response = await client.get('/lottery/api/games')

    response.assertStatus(200)
    response.assertBodyContains({types: {meta: {total: 0},data: []}})
  })

})
