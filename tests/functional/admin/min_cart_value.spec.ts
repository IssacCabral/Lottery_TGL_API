import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import { RoleAdminFactory, UserFactory } from 'Database/factories'

test.group('Admin min cart value', (group) => {
  group.tap((test) => test.tags(['@min_cart_value']))

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return (() => Database.rollbackGlobalTransaction())
  })

  test('admin must be logged in before set min cart value', async ({client}) => {
    const response = await client.post('/lottery/api/carts')
    
    response.assertStatus(401)
    response.assertBodyContains({
      errors: [
        { message: 'E_UNAUTHORIZED_ACCESS: Unauthorized access' }
      ]
    })
  })

  test('user logged must be admin before creating a game', async ({ client }) => {
    const user = await UserFactory.query().create()
    const response = await client.post('/lottery/api/carts').loginAs(user)

    response.assertStatus(403)
    response.assertBodyContains({
      message: "your user aren't authorized"
    })

  })

  test('make sure minCartValue is provided', async ({ client }) => {
    const user = await UserFactory.query().create()
    const roleAdmin = await RoleAdminFactory.query().create()

    await user.related('roles').attach([roleAdmin.id])

    const response = await client.post('/lottery/api/carts').loginAs(user)

    response.assertStatus(422)
    response.assertBodyContains({
      "errors": [
        {
          "rule": "required",
          "field": "minCartValue",
          "message": "minCartValue field is required"
        }
      ]
    })

  })

  test('sure minCartValue is a number', async ({client}) => {
    const user = await UserFactory.query().create()
    const roleAdmin = await RoleAdminFactory.query().create()

    await user.related('roles').attach([roleAdmin.id])

    const response = await client.post('/lottery/api/carts').loginAs(user).form({
      minCartValue: 'foo'
    })

    response.assertStatus(422)
    response.assertBodyContains({
      "errors": [
        {
          "rule": "number",
          "field": "minCartValue",
          "message": "minCartValue field is invalid number"
        }
      ]
    })
  })

  test('set min cart value with an authenticated admin', async ({client, assert}) => {
    const user = await UserFactory.query().create()
    const roleAdmin = await RoleAdminFactory.query().create()

    await user.related('roles').attach([roleAdmin.id])

    const response = await client.post('/lottery/api/carts').loginAs(user).form({
      minCartValue: 9.75
    })

    response.assertStatus(200)
    assert.exists(response.body().findedCart)
    assert.equal(response.body().findedCart.min_cart_value, 9.75)
  })

})
