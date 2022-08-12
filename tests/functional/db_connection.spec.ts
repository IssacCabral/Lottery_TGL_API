import { test } from '@japa/runner'

test.group('Healthy Db Connection', () => {
  test('healthy db connection', async ({client}) => {
    const response = await client.get('/healthy')
  
    response.assertStatus(200)
    response.assertBodyContains({message: "All connections are healthy"})
  })

})