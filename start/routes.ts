import Route from '@ioc:Adonis/Core/Route'


// public routes
Route.group(() => {
  Route.post('/login', 'AuthController.login')
  Route.post('/users', 'UsersController.store')
}).prefix('lottery/api')


// admin routes  
Route.group(() => {
  Route.resource('/games', 'GamesController').apiOnly()
  Route.resource('/users', 'UsersController').only(['index', 'destroy'])
})
  .prefix('lottery/api')
  .middleware(['auth', 'is:admin'])

  
// players routes
Route.group(() => {
  Route.resource('/users', 'UsersController').except(['store', 'index', 'destroy'])
})
  .prefix('lottery/api')
  .middleware(['auth', 'is:player'])
