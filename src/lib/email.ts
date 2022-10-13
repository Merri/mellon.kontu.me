import nodemailer from 'nodemailer'
import type Mail from 'nodemailer/lib/mailer'
import sgMail from '@sendgrid/mail'

import { getLogger } from './bugsnag'

import type { Member } from '$/types/db'

sgMail.setApiKey(import.meta.env.SENDGRID_API_KEY)

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

/** Get sanitized from/to field. */
export function sanitizeEmailField(name: string, email: string) {
	return `"${name.replace(/"|\\/g, '')}" <${email.replace(/<|>|"|\\/g, '')}>`
}

/** App primary email for from/to field. */
export const appEmailField = sanitizeEmailField(import.meta.env.PRIMARY_EMAIL_NAME, import.meta.env.PRIMARY_EMAIL_FROM)

/** Get member email for from/to field. */
export function getMemberEmailField(member: Member) {
	if (!member.email || !member.email.includes('@')) {
		getLogger().notify(new Error(`Invalid email: <${member.email}>`))
		return undefined
	}

	const receiver = `${member.fullname || member.publicname || member.email}`
	return sanitizeEmailField(receiver, member.email)
}

/** Sends mail defaulting sender to the app primary email. */
export function sendMailSMTP(options: Mail.Options) {
	transporter.sendMail({ from: appEmailField, ...options }, logError)
}

interface MailData {
	to?: string
	subject: string
	text: string
	html: string
}

/** Sends mail using SendGrid API. */
export async function sendMail(mailData: MailData) {
	await sgMail.send({ from: appEmailField, ...mailData }).catch(logError)
}
