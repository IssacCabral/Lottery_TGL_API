import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import StoreValidator from 'App/Validators/User/StoreValidator'

export default class UsersController {
  public async index({}: HttpContextContract) {

  }

  public async store({request, response}: HttpContextContract) {
    await request.validate(StoreValidator)

    const userBody = request.only(['name', 'cpf', 'email', 'password'])

    

    response.ok({message: 'Você chegou aqui amiegan!!'})
  }

  public async show({}: HttpContextContract) {

  }

  public async update({}: HttpContextContract) {

  }

  public async destroy({}: HttpContextContract) {}

}
