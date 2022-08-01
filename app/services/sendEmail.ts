import User from "App/Models/User";
import Mail from "@ioc:Adonis/Addons/Mail";


export async function sendNewUserEmail(user: User, template: string): Promise<void>{
    await Mail.send((message) => {
        message.from('lottery-tgl-api@email.com')
            .to(user.email)
            .subject('Welcome to Lottery TGL')
            .htmlView(template, {user})
    })
}

export async function sendNewBetEmail(user: User, template: string, cartTotalValue: number): Promise<void>{
    await Mail.send((message) => {
        message.from('lottery-tgl-api@email.com')
            .to(user.email)
            .subject('Nice for make new Bets')
            .htmlView(template, {user, cartTotalValue})
    })
}

export async function sendRememberTokenEmail(user: User, template: string): Promise<void>{
    await Mail.send((message) => {
        message.from('lottery-tgl-api@email.com')
            .to(user.email)
            .subject('Recover Your password')
            .htmlView(template, {user})
    })
}

export async function sendRememberToBetEmail(user: User, template: string): Promise<void>{
    await Mail.send((message) => {
        message.from('lottery-tgl-api@email.com')
            .to(user.email)
            .subject('We are missing you')
            .htmlView(template, {user})
    })
}