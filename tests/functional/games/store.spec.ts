import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory } from 'Database/factories'

test.group('Games store', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return (() => Database.rollbackGlobalTransaction())
  })

  test('user must be logged in before creating the post', async ({ client }) => {
    const response = await client.post('/lottery/api/games').form({
      type: "Quina",
      description: "Escolha 5 números dos 80 disponíveis na quina. 5, 4, 3 ou 2 acertos. São seis sorteios semanais e seis chances de ganhar.",
      range: 80,
      price: 2,
      min_and_max_number: 5,
      color: "#F79C31",
    })

    response.assertStatus(401)
    response.assertBodyContains({
      errors: [
        {message: 'E_UNAUTHORIZED_ACCESS: Unauthorized access'}
      ]
    })
  })

  test('make sure attributes is provided', async ({client}) => {
    const user = await UserFactory.query().create()
    const response = await client.post('/lottery/api/games').loginAs(user)

    console.log(response.body())

    // response.assertStatus(422)
    // response.assertBodyContains({
    //   errors: [
    //     {
    //       "rule": "required",
    //       "field": "type",
    //       "message": "type field is required"
    //     },
    //     {
    //       "rule": "required",
    //       "field": "description",
    //       "message": "description field is required"
    //     },
    //     {
    //       "rule": "required",
    //       "field": "range",
    //       "message": "range field is required"
    //     },
    //     {
    //       "rule": "required",
    //       "field": "price",
    //       "message": "price field is required"
    //     },
    //     {
    //       "rule": "required",
    //       "field": "minAndMaxNumber",
    //       "message": "minAndMaxNumber field is required"
    //     },
    //     {
    //       "rule": "required",
    //       "field": "color",
    //       "message": "color field is required"
    //     }
    //   ]
    // })

    

  })

})
