import User from "App/Models/User";
import Mail from "@ioc:Adonis/Addons/Mail";


export async function sendEmail(user: User, template: string): Promise<void>{
    await Mail.send((message) => {
        message.from('lottery-tgl-api@email.com')
            .to(user.email)
            .subject('Welcome to Lottery TGL')
            .htmlView(template, {user})
    })
}