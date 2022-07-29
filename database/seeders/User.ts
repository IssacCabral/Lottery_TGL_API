import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import User from 'App/Models/User'
import Role from 'App/Models/Role'

export default class extends BaseSeeder {
  public async run () {
    // admin user
    const searchKeyAdmin = {email: 'admin@email.com'}
    const userAdmin = await User.updateOrCreate(searchKeyAdmin, {
      name: 'Admin',
      cpf: '000.000.000-00',
      email: 'admin@email.com',
      password: 'secret'
    }) 

    const roleAdmin = await Role.findBy('name', 'admin')
    if(roleAdmin) await userAdmin.related('roles').attach([roleAdmin.id]) 

    // player user
    const searchKeyPlayer = {email: 'player@email.com'}
    const userPlayer = await User.updateOrCreate(searchKeyPlayer, {
      name: 'Player',
      cpf: '000.000.000-01',
      email: 'player@email.com',
      password: 'secret'
    }) 

    const rolePlayer = await Role.findBy('name', 'player')
    if(rolePlayer) await userPlayer.related('roles').attach([rolePlayer.id]) 
  }
}
