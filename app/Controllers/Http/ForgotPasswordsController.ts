import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import ResetPasswordValidator from 'App/Validators/Forgot-Password/ResetPasswordValidator'
import RecoveryPasswordValidator from 'App/Validators/Forgot-Password/RecoveryPasswordValidator'
import User from 'App/Models/User'

import crypto from 'crypto'
import { sendRememberTokenEmail } from 'App/services/sendEmail'
import { DateTime } from 'luxon'

import moment from 'moment'

import {ValidationException} from '@ioc:Adonis/Core/Validator'

export default class ForgotPasswordsController {
    public async store({ request, response }: HttpContextContract) {
        const { email } = await request.validate(ResetPasswordValidator)
        const user = await User.findByOrFail('email', email)

        const rememberMeToken = crypto.randomBytes(12).toString('hex')

        user.rememberMeToken = rememberMeToken
        user.tokenCreatedAt = DateTime.now()
        
        await user.save()
        
        try {
            await sendRememberTokenEmail(user, 'mail/forgot-password')
        } catch (error) {
            return response.badRequest({ message: 'error in send recovery email', originalError: error.message })
        }

        return response.ok({message: 'check your email input to find the token'})
    }

    public async update({ request, response }: HttpContextContract){
        const {token, password} = await request.validate(RecoveryPasswordValidator)
        const user = await User.findByOrFail('remember_me_token', token)

        const tokenExpired = moment().subtract('2', 'days').isAfter(user.tokenCreatedAt)
        
        if(tokenExpired) throw new ValidationException(false, 'token expired')

        user.rememberMeToken = null
        user.tokenCreatedAt = null
        user.password = password

        await user.save()

        return response.ok({message: 'password updated successfully!'})
    }
}
