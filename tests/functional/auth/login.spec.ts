import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import { UserFactory, RoleAdminFactory, RolePlayerFactory } from 'Database/factories'

import User from 'App/Models/User'

test.group('Auth login', (group) => {
  group.tap((test) => test.tags(['@login']))
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return (() => Database.rollbackGlobalTransaction())
  })

  test('make sure admin user credentials is valid', async ({ client }) => {
    const user = await UserFactory.query().create()
    const roleAdmin = await RoleAdminFactory.query().create()

    user.related('roles').attach([roleAdmin.id])

    const response = await client.post('/lottery/api/login').form({
      email: user.email,
      password: 1
    })

    response.assertStatus(401)
    response.assertBodyContains({
      "message": "Invalid credentials"
    })
  })

  test('make sure player user credentials is valid', async ({ client }) => {
    const user = await UserFactory.query().create()
    const rolePlayer = await RolePlayerFactory.query().create()

    user.related('roles').attach([rolePlayer.id])

    const response = await client.post('/lottery/api/login').form({
      email: user.email,
      password: 1
    })

    response.assertStatus(401)
    response.assertBodyContains({
      "message": "Invalid credentials"
    })
  })

  test('ensure to authenticate the user and return the token when everything is fine', async ({ client, assert,  }) => {
    const user = new User()

    user.fill({
      name: 'Issac Cabral',
      cpf: "000.000.000-00",
      email: 'issac@email.com',
      password: 'secret'
    })

    await user.save()

    const rolePlayer = await RolePlayerFactory.query().create()

    user.related('roles').attach([rolePlayer.id])

    const response = await client.post('/lottery/api/login').form({
      email: 'issac@email.com',
      password: 'secret'
    })

    response.assertStatus(200)
    assert.exists(JSON.parse(response.text()).token)
    assert.equal(JSON.parse(response.text()).token.type, 'bearer')
  })

})
