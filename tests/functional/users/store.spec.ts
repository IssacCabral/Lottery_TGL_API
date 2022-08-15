import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory } from 'Database/factories'

test.group('Users store', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return (() => Database.rollbackGlobalTransaction())
  })

  test('make sure attributes is provided', async ({ client }) => {
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

  test('make sure cpf is a unique field', async ({ client }) => {
    const user = await UserFactory.query().create()

    const response = await client.post('/lottery/api/users').form({
      name: 'Issac Cabral',
      cpf: user.cpf,
      email: 'issac@email.com',
      password: 'secret'
    })

    response.assertStatus(422)
    response.assertBodyContains({
      "errors": [
        {
          "rule": "unique",
          "field": "cpf",
          "message": "cpf already exists"
        }
      ]
    })

  })

  test('make sure email is a unique field', async ({ client }) => {
    const user = await UserFactory.query().create()

    const response = await client.post('/lottery/api/users').form({
      name: 'Issac Cabral',
      cpf: '000.000.000-00',
      email: user.email,
      password: 'secret'
    })

    response.assertStatus(422)
    response.assertBodyContains({
      "errors": [
        {
          "rule": "unique",
          "field": "email",
          "message": "email already exists"
        }
      ]
    })

  })

  test('make sure cpf or/and email is a unique field', async ({ client }) => {
    const user1 = await UserFactory.query().create()

    const response = await client.post('/lottery/api/users').form({
      name: 'Issac Cabral',
      cpf: user1.cpf,
      email: user1.email,
      password: 'secret'
    })

    response.assertStatus(422)
    response.assertBodyContains({
      "errors": [
        {
          "rule": "unique",
          "field": "cpf",
          "message": "cpf already exists"
        },
        {
          "rule": "unique",
          "field": "email",
          "message": "email already exists"
        }
      ]
    })
  })

  test('make sure cpf field is in a valid format', async ({client}) => {
    const response = await client.post('/lottery/api/users').form({
      name: 'Issac Cabral',
      cpf: '065.553-33178',
      email: 'issac@email.com',
      password: 'secret'
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          rule: 'regex',
          field: 'cpf',
          message: 'cpf field with invalid format'
        }
      ]
    })
  })

  test('make sure email field is in a valid format', async ({client}) => {
    const response = await client.post('/lottery/api/users').form({
      name: 'Issac Cabral',
      cpf: '000.000.000-00',
      email: '123Iss@ac@email.com',
      password: 'secret'
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          "rule": "email",
          "field": "email",
          "message": "email field should be a valid email"
        }
      ]
    })
  })

})
