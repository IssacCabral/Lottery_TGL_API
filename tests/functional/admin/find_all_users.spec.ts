import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import { RoleAdminFactory, UserFactory } from 'Database/factories'
import User from 'App/Models/User'

test.group('Admin find all users', (group) => {
  group.tap((test) => test.tags(['@find_all_users']))

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return (() => Database.rollbackGlobalTransaction())
  })

  test('admin must be logged in before index users', async ({ client }) => {
    const response = await client.get('/lottery/api/users')

    response.assertStatus(401)
    response.assertBodyContains({
      errors: [
        { message: 'E_UNAUTHORIZED_ACCESS: Unauthorized access' }
      ]
    })
  })

  test('user logged must be admin before index users', async ({ client }) => {
    const user = await UserFactory.query().create()
    const response = await client.get('/lottery/api/users').loginAs(user)

    response.assertStatus(403)
    response.assertBodyContains({
      message: "your user aren't authorized"
    })
  })

  test('get a paginated list of existing users', async ({ client, assert }) => {
    const userAdmin = await UserFactory.query().create()
    const roleAdmin = await RoleAdminFactory.query().create()
    await userAdmin.related('roles').attach([roleAdmin.id])

    await UserFactory.query().createMany(10)

    const response = await client.get('/lottery/api/users').loginAs(userAdmin)

    const usersCreated = await User.query().orderBy('id', 'desc').limit(11)

    assert.containsSubset(usersCreated.map((row) => row.toJSON()), response.body().users.data)

    response.assertStatus(200)
    response.assertBodyContains({ users: { meta: { total: 11, per_page: 4, current_page: 1 } } })
  })

  test('get a no paginated list of existing users', async ({ client }) => {
    const userAdmin = await UserFactory.query().create()
    const roleAdmin = await RoleAdminFactory.query().create()
    await userAdmin.related('roles').attach([roleAdmin.id])

    await UserFactory.query().createMany(10)

    const response = await client.get('/lottery/api/users').loginAs(userAdmin).qs({ noPaginate: true })

    const usersCreated = await User.query().orderBy('id', 'desc').limit(11)

    response.assertStatus(200)
    response.assertBodyContains(usersCreated.map((row) => row.toJSON()))
  })

})
