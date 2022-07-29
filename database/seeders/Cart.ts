import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import Cart from 'App/Models/Cart'

export default class extends BaseSeeder {
  public async run () {

    const searchKeyCart = {minCartValue: 40.00}

    await Cart.query().delete()
    await Cart.create(searchKeyCart)

  }
}
