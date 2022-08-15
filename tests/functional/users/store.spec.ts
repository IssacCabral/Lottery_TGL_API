import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Users store', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return (() => Database.rollbackGlobalTransaction())
  })

  test('make sure attributes is provided', async ({client, assert}) => {
    const response = await client.post('/lottery/api/users')

    response.assertStatus(422)
    response.assertBodyContains({
      "errors": [
        {
          "rule": "required",
          "field": "name",
          "message": "name field is required"
        },
        {
          "rule": "required",
          "field": "cpf",
          "message": "cpf field is required"
        },
        {
          "rule": "required",
          "field": "email",
          "message": "email field is required"
        },
        {
          "rule": "required",
          "field": "password",
          "message": "password field is required"
        }
      ]
    })
  })

  test('', async ({client}) => {
    
  })

})
