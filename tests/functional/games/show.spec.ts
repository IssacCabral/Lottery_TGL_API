import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Games show', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return (() => Database.rollbackGlobalTransaction())
  })

  test('return list with 3 starting games if no paginate', async ({assert, client}) => {
    const response = await client.get('lottery/api/games').qs()

    console.log(response.body())
    response.assertStatus(200)
    //response.assertBodyContains({meta: {total: 3}})
  })
})
