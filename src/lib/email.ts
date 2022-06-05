import nodemailer from 'nodemailer'
import type Mail from 'nodemailer/lib/mailer'

import { getLogger } from './bugsnag'

import type { Member } from '$/types/db'

const transporter = nodemailer.createTransport({
	host: import.meta.env.PRIMARY_EMAIL_HOST,
	port: import.meta.env.PRIMARY_EMAIL_PORT,
	secure: true,
	auth: {
		user: import.meta.env.PRIMARY_EMAIL_USER,
		pass: import.meta.env.PRIMARY_EMAIL_PW,
	},
})

function logError(error: Error | null) {
	if (error) {
		getLogger().notify(error)
	}
}

/** App primary email for from/to field. */
export const appEmailField = `"${import.meta.env.PRIMARY_EMAIL_NAME.replace(
	/"|\\/g,
	''
)}" <${import.meta.env.PRIMARY_EMAIL_FROM.replace(/<|>|"|\\/g, '')}>`

/** Get member email for from/to field. */
export function getMemberEmailField(member: Member) {
	if (!member.email || !member.email.includes('@')) {
		getLogger().notify(new Error(`Invalid email: <${member.email}>`))
		return undefined
	}

	const receiver = `${member.fullname || member.publicname || member.email}`.replace(/"|\\/g, '')
	return `"${receiver}" <${member.email.replace(/<|>|"|\\/g, '')}>`
}

/** Sends mail defaulting sender to the app primary email. */
export function sendMail(options: Mail.Options) {
	transporter.sendMail({ from: appEmailField, ...options }, logError)
}
