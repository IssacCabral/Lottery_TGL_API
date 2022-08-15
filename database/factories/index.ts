import Factory from '@ioc:Adonis/Lucid/Factory'

import Game from 'App/Models/Game'
import Cart from 'App/Models/Cart'
import User from 'App/Models/User'
import Role from 'App/Models/Role'
import Bet from 'App/Models/Bet'

export const GameFactory = Factory.define(Game, ({faker}) => {
    return {
        type: faker.random.words(2),
        description: faker.lorem.paragraph(),
        range: faker.datatype.number({min: 21, max: 70}),
        price: faker.datatype.number(100),
        color: faker.internet.color(),
        minAndMaxNumber: faker.datatype.number({min: 1, max: 20})
    }
}).build()

export const CartFactory = Factory.define(Cart, ({faker}) => {
    return {
        minCartValue: faker.datatype.number(100)
    }
}).build()

export const UserFactory = Factory.define(User, ({faker}) => {
    return {
        name: faker.name.firstName() + ' ' + faker.name.lastName(),
        cpf: "000.000.000-00",
        email: faker.internet.email(),
        password: faker.internet.password()
    }
})
    .relation('roles', () => RoleAdminFactory)
    .build()
 
export const RoleAdminFactory = Factory.define(Role, () => {
    return {
        name: 'admin',
        description: 'Access all resources of the system'
    }
}).build()

export const RolePlayerFactory = Factory.define(Role, () => {
    return {
        name: 'player',
        description: 'Access to bets and CRUD yourself'
    }
}).build()

export const BetFactory = Factory.define(Bet, () => {
    return {
        
    }
})