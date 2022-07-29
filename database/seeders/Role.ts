import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class extends BaseSeeder {
  public async run () {
    const uniqueKey = 'name'

    await Role.updateOrCreateMany(uniqueKey, [
      {
        name: 'admin',
        description: 'Access all resources of the system'
      },
      {
        name: 'player',
        description: 'Access to bets and CRUD yourself'
      }
    ])
  }
}
