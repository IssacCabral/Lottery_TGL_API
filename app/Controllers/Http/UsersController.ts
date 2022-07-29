import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

import StoreValidator from 'App/Validators/User/StoreValidator'
import UpdateValidator from 'App/Validators/User/UpdateValidator'

import User from 'App/Models/User'
import Role from 'App/Models/Role'

export default class UsersController {
  public async index({request, response}: HttpContextContract) {
    const {page, limit, noPaginate, ...inputs} = request.qs()

    if(noPaginate){
      return await User.query().filter(inputs)
    }

    try{
      const users = await User.query()
        .filter(inputs)
        .paginate(page || 1, limit || 10)

      return response.ok({users})
    } catch(error){
      return response.badRequest({ message: 'error in list users', originalError: error.message })
    }
  }

  public async store({request, response}: HttpContextContract) {
    await request.validate(StoreValidator)

    const userBody = request.only(['name', 'cpf', 'email', 'password'])

    let user = new User()

    const trx = await Database.transaction()

    try{
      user.fill(userBody)

      user.useTransaction(trx)

      await user.save()

      const playerRole = await Role.findByOrFail('name', 'player')

      if(playerRole){
        await user.related('roles').attach([playerRole.id])
      }
    } catch(error){
      trx.rollback()
      return response.badRequest({message: 'error in create user', originalError: error.message})
    }

    trx.commit()
    
    let createdUser
    try{
      createdUser = await User.query().where('id', user.id).preload('roles')
    } catch(error){
      return response.notFound({message: 'error in find the created user', originalError: error.message})
    }

    response.ok({createdUser})
  }

  public async show({response, params}: HttpContextContract) {
    const userSecureId = params.id

    try{
      const searchUser = await User.query().where('secure_id', userSecureId).preload('roles')

      return response.ok({searchUser})
    } catch(error){
      return response.notFound({message: 'user not found', originalError: error.message})
    }
  }

  public async update({request, response, params}: HttpContextContract) {
    await request.validate(UpdateValidator)

    const userBody = request.only(['name', 'cpf', 'email', 'password'])
    const secureId = params.id

    let user = new User()

    const trx = await Database.transaction()

    // const checkId = auth.user?.secure_id == secureId

    /*
    if(!checkId){
      throw new Error('You don/\'t have permissions to alter other user')
    }
    */
    try{
      user = await User.findByOrFail('secure_id', secureId)

      user.useTransaction(trx)

      await user.merge(userBody).save()

    } catch(error){
      trx.rollback()
      return response.badRequest({message: 'error in update user', originalError: error.message})
    }

    trx.commit()

    let updatedUser
    try{
      updatedUser = await User.query().where('id', user.id).preload('roles')
    } catch(error){
      return response.notFound({message: 'error in find the updated user', originalError: error.message})
    }

    response.ok({updatedUser})
  }

  public async destroy({response, params}: HttpContextContract) {
    const userSecureId = params.id

    try{
      const deleteThisUser = await User.findByOrFail('secure_id', userSecureId)

      await deleteThisUser.delete()

      return response.ok({message: 'user successfull deleted'})
    } catch(error){
      return response.notFound({message: 'user not found', originalError: error.message})
    }
  }

}
