import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { GameFactory, CartFactory } from 'Database/factories'
import Game from 'App/Models/Game'

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

    test('get a paginated list of existing games', async ({ client, assert }) => {
        await GameFactory.query().createMany(10)

        const response = await client.get('/lottery/api/games')
        const games = await Game.query().orderBy('id', 'desc').limit(4)

        assert.containsSubset(games.map((row) => row.toJSON()), response.body().types.data)

        response.assertStatus(200)
        response.assertBodyContains({ types: { meta: { total: 10, per_page: 4, current_page: 1 } }})
    })

    test('get a no paginated list of existing games', async ({client, assert}) => {
        await GameFactory.query().createMany(3)

        const response = await client.get('/lottery/api/games').qs({noPaginate: true})

        response.assertStatus(200)
        assert.containsSubset(response.body(), {types: []})
    })

    test('define custom per page result set', async({client, assert}) => {
        await GameFactory.query().createMany(20)

        const response = await client.get('/lottery/api/games').qs({per_page: 20})
        const games = await Game.query().orderBy('id', 'desc').limit(20)

        assert.containsSubset(games.map((row) => row.toJSON()), response.body().types.data)

        response.assertStatus(200)
        response.assertBodyContains({ types: { meta: { total: 20, per_page: 20, current_page: 1 }, data: [] } })
    })

    test('return minCartValue when get a paginated list of existing games', async ({client, assert}) => {
        await GameFactory.query().createMany(3)
        const cart = await CartFactory.query().create()
        
        const response = await client.get('/lottery/api/games')

        response.assertStatus(200)
        response.assertBodyContains({ 
            types: { 
                meta: { total: 3, per_page: 4, current_page: 1 } 
            },
            minCartValue: cart.minCartValue
        })
    })

})
