import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GamesController {
  public async index({response}: HttpContextContract) {
    return response.ok({message: 'retorna os games'})
  }

  public async store({response}: HttpContextContract) {
    return response.ok({message: 'salva um game'})
  }

  public async show({response}: HttpContextContract) {
    return response.ok({message: 'retorna um game'})
  }

  public async update({response}: HttpContextContract) {
    return response.ok({message: 'atualiza um game'})
  }

  public async destroy({response}: HttpContextContract) {
    return response.ok({message: 'exclui um game'})
  }
}
