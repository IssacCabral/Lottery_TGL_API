import Route from '@ioc:Adonis/Core/Route'


// public routes
Route.group(() => {
  Route.post('/login', 'AuthController.login')
  Route.post('/users', 'UsersController.store')
}).prefix('lottery/api')


// admin routes  
Route.group(() => {
  Route.resource('/games', 'GamesController').apiOnly()

  Route.get('/users', 'AdminsController.findAllUsers')
  Route.post('/users/set-user-roles', 'AdminsController.promoteUser')
  Route.delete('/users/:id', 'AdminsController.destroyUser')

  Route.post('/carts', 'AdminsController.setMinCartValue')
})
  .prefix('lottery/api')
  .middleware(['auth', 'is:admin'])

  
// players routes
Route.group(() => {
  Route.get('/users/:id', 'UsersController.show')
  Route.put('/users/:id', 'UsersController.update')
})
  .prefix('lottery/api')
  .middleware(['auth', 'is:player'])
