import { test } from '@japa/runner'

test('display welcome page', async ({ client }) => {
  const response = await client.get('/')

  response.assertStatus(200)
  response.assertBodyContains({ hello: 'world' })
})

test('healthy db connection', async ({client}) => {
  const response = await client.get('/healthy')

  response.assertStatus(200)
  response.assertBodyContains({message: "All connections are healthy"})
})

function sum(a: number, b: number): number{
  return a + b
}

test('add two numbers', ({assert}) => {
  assert.equal(sum(2, 2), 4)
})