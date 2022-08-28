import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'

// test health connection
Route.get('/healthy', async ({ response }: HttpContextContract) => {
  await Database.report().then(({ health }) => {
    const { healthy, message } = health

    if (healthy) return response.ok({ message })

    return response.status(500).json({ message })
  })
})


// public routes
Route.group(() => {
  Route.post('/login', 'AuthController.login')
  Route.post('/users', 'UsersController.store')

  Route.post('/forgot-password', 'ForgotPasswordsController.store')
  Route.put('/recovery-password', 'ForgotPasswordsController.update')

  Route.get('/games', 'GamesController.index')
}).prefix('lottery/api')


// admin routes  
Route.group(() => {
  Route.resource('/games', 'GamesController').except(['index'])

  Route.get('/users', 'AdminsController.findAllUsers')
  Route.post('/users/set-user-roles', 'AdminsController.setUserRoles')
  Route.delete('/users/:id', 'AdminsController.destroyUser')

  Route.post('/carts', 'AdminsController.setMinCartValue')
})
  .prefix('lottery/api')
  .middleware(['auth', 'is:admin'])

// players routes
Route.group(() => {
  Route.get('/users/:id', 'UsersController.show')
  Route.put('/users/:id', 'UsersController.update')

  Route.resource('/bets', 'BetsController').only(['store', 'show', 'index'])
})
  .prefix('lottery/api')
  .middleware(['auth', 'is:player'])


//import Producer from '../kafka/Producer'

import producer from '../kafka/Producer'

Route.get('/hello-world', async ({ response }: HttpContextContract) => {
  //const producer = new Producer()

  await producer.connect()

  await producer.send({topic: 'hello-world', messages: [{value: JSON.stringify({name: 'clidenor'})}]})

  await producer.disconnect()

  // await producer.sendMessage([{value: JSON.stringify('Hello My friend')}], 'hello-world')

  // await producer.disconnect()

  return response.ok({ hello: 'world' })
})
