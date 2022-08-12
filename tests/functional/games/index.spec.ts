import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { GameFactory } from 'Database/factories'

test.group('Games index', (group) => {
    group.each.setup(async () => {
        await Database.beginGlobalTransaction()

        return (() => Database.rollbackGlobalTransaction())
    })

    test('return empty list when there are no games', async ({ client }) => {
        const response = await client.get('/lottery/api/games')

        response.assertStatus(200)
        response.assertBodyContains({ types: { meta: { total: 0 }, data: [] } })
    })

    test('get a paginated list of existing games', async ({ client }) => {
        await GameFactory.query().createMany(40)

        const response = await client.get('/lottery/api/games')
        response.assertBodyContains({ types: { meta: { total: 40, per_page: 10, current_page: 1 } } })
        response.assertStatus(200)
    })

    test('', async () => {

    })

})
