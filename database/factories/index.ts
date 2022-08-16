import Factory from '@ioc:Adonis/Lucid/Factory'

import Game from 'App/Models/Game'
import Cart from 'App/Models/Cart'
import User from 'App/Models/User'
import Role from 'App/Models/Role'
import Bet from 'App/Models/Bet'

import generateCpf from '../../tests/utils/random-cpf'

export const GameFactory = Factory.define(Game, ({ faker }) => {
    return {
        type: faker.random.words(2),
        description: faker.lorem.paragraph(),
        range: faker.datatype.number({ min: 21, max: 70 }),
        price: faker.datatype.number(100),
        color: faker.internet.color(),
        minAndMaxNumber: faker.datatype.number({ min: 1, max: 20 })
    }
}).build()

export const QuinaFactory = Factory.define(Game, ({  }) => {
    return {
        type: "Quina",
        description: "Escolha 5 números dos 80 disponíveis na quina. 5, 4, 3 ou 2 acertos. São seis sorteios semanais e seis chances de ganhar.",
        range: 80,
        price: 2,
        minAndMaxNumber: 5,
        color: "#F79C31",
    }
}).build()
export const MegaSenaFactory = Factory.define(Game, ({  }) => {
    return {
        type: "Mega-Sena",
        description: "Escolha 6 números dos 60 disponíveis na mega-sena. Ganhe com 6, 5 ou 4 acertos. São realizados dois sorteios semanais para você apostar e torcer para ficar milionário.",
        range: 60,
        price: 4.5,
        minAndMaxNumber: 6,
        color: "#01AC66"
    }
}).build()
export const LotoFacilFactory = Factory.define(Game, ({  }) => {
    return {
        type: "Lotofácil",
        description: "Escolha 15 números para apostar na lotofácil. Você ganha acertando 11, 12, 13, 14 ou 15 números. São muitas chances de ganhar, e agora você joga de onde estiver!",
        range: 25,
        price: 2.5,
        minAndMaxNumber: 15,
        color: "#7F3992",
    }
}).build()

export const CartFactory = Factory.define(Cart, ({ faker }) => {
    return {
        minCartValue: faker.datatype.number(100)
    }
}).build()

export const UserFactory = Factory.define(User, ({ faker }) => {
    return {
        name: faker.name.firstName() + ' ' + faker.name.lastName(),
        cpf: generateCpf(),
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