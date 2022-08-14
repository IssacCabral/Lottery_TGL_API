import Factory from '@ioc:Adonis/Lucid/Factory'

import Game from 'App/Models/Game'
import Cart from 'App/Models/Cart'
import User from 'App/Models/User'

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
}).build()