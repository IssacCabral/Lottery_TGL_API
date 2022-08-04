import { BaseTask } from 'adonis5-scheduler/build'
import Logger from '@ioc:Adonis/Core/Logger'
import dayjs from 'dayjs'
// plugin para conseguir setar qual a localidade de horas
// que vamos trabalhar
import isLeapYear from 'dayjs/plugin/isLeapYear'
import 'dayjs/locale/pt-br'

import User from 'App/Models/User'

import { DateTime } from 'luxon'
import moment from 'moment'

import { sendRememberToBetEmail } from '../services/sendEmail'

export default class RememberUserToBet extends BaseTask {
	public static get schedule() {
		return '0 0 9 * * *'
		//return '0 * * * * *'
	}
	/**
	 * Set enable use .lock file for block run retry task
	 * Lock file save to `build/tmpTaskLock`
	 */
	public static get useLock() {
		return false
	}

	public async handle() {
		dayjs.extend(isLeapYear)
		dayjs.locale('pt-br')

		const users = await User.all()

		await Promise.all(
			users.map(async (user) => {
				if (user.lastBet) {
					const lastBetYear = user.lastBet.year
					const lasBetMonth = user.lastBet.month
					const lastBetDay = user.lastBet.day

					const { year, month, day } = DateTime.now()

					const isTimeToSendTheEmail = moment(new Date(year, month, day), "YYYY-MM-DD")
						.subtract(7, 'days')
						.isAfter(new Date(lastBetYear, lasBetMonth, lastBetDay))

					if (isTimeToSendTheEmail) {
						try {
							await sendRememberToBetEmail(user, 'mail/remember-bet')
							return Logger.info('Email sent')
						} catch (error) {
							return Logger.error('Error in send email')
						}
					}

				} else {
					try {
						await sendRememberToBetEmail(user, 'mail/remember-bet')
						return Logger.info('Email sent')
					} catch (error) {
						return Logger.error('Error in send email')
					}

				}

			})
		)

		Logger.info('Handled')
	}
}
