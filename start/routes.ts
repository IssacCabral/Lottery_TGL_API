import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * admin
 *  alterar o valor de min_cart_value
 *  alterar os games
 *  dar permissões para usuários players
 * 
 * player
 *  crud de si mesmo
 *  alterar suas próprias bets
 */

// rota para testar a conexão com o banco
Route.get('/test_db_connections', async ({response}: HttpContextContract) => {
  await Database.report().then(({health}) => {
    const {healthy, message} = health

    if(healthy) return response.ok({message})

    return response.status(500).json({message})
  })
})


Route.group(() => {
  Route.resource('/games', 'GamesController').apiOnly()
  Route.resource('/users', 'UsersController').apiOnly()
})
  .prefix('lottery/api')
