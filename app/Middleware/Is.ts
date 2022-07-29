import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'

export default class Is {
  public async handle({auth, response}: HttpContextContract, next: () => Promise<void>, guards?: string[]) {
    const userId = auth.user?.id
    let isNext = false

    if(userId && guards){
      const user = await User.query().where('id', userId).preload('roles').first()
      const userJson = user?.serialize()


      userJson?.roles.forEach(({name}) => {
        guards.forEach((roleNameGuards) => {
          if(name.toLowerCase() === roleNameGuards.toLowerCase()){
            isNext = true
          }
        })
      })
      
    }

    return isNext ? next() : response.forbidden({message: "your user aren't authorized"})
  }
}
