import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import Cart from 'App/Models/Cart'

import SetMinCartValueValidator from 'App/Validators/User/SetMinCartValueValidator'
import SetUserRolesValidator from 'App/Validators/User/SetUserRolesValidator'
import Role from 'App/Models/Role'

export default class AdminsController {
  public async promoteUser({request, response}: HttpContextContract){
    await request.validate(SetUserRolesValidator)

    const {userId, roles} = request.all()

    try{
      const userToSetRoles = await User.findByOrFail('id', userId)

      let roleIds: number[] = []

      await Promise.all(
        roles.map(async (roleName) => {
          const hasRole = await Role.findBy('name', roleName)
          if(hasRole) roleIds.push(hasRole.id)
        })
      )

      await userToSetRoles.related('roles').sync(roleIds)
    } catch(error){
      return response.badRequest({message: 'Error in access allow', originalError: error.message})
    }

    try{
      return User.query().where('id', userId).preload('roles').firstOrFail()
    } catch(error){
      return response.notFound({message: 'error in find user', originalError: error.message})
    }

  }

  public async setMinCartValue({request, response}: HttpContextContract) {
    await request.validate(SetMinCartValueValidator)

    const {minCartValue} = request.all()

    await Cart.query().delete()

    return response.ok({findedCart: await Cart.firstOrCreate({minCartValue})})
  }

  public async findAllUsers({ request, response }: HttpContextContract) {
    const { page, limit, noPaginate, ...inputs } = request.qs()

    if (noPaginate) {
      return await User.query().filter(inputs).preload('roles')
    }

    try {
      const users = await User.query()
        .filter(inputs)
        .paginate(page || 1, limit || 10)

      return response.ok({ users })
    } catch (error) {
      return response.badRequest({ message: 'error in list users', originalError: error.message })
    }
  }

  public async destroyUser({response, params }: HttpContextContract) {
    const userSecureId = params.id

    try {
      const deleteThisUser = await User.findByOrFail('secure_id', userSecureId)

      await deleteThisUser.delete()

      return response.ok({ message: 'user successfull deleted' })
    } catch (error) {
      return response.notFound({ message: 'user not found', originalError: error.message })
    }
  }
}
