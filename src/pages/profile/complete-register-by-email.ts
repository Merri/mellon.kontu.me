import validatePhoneNumber from 'phone'

import {
	getEmailFromLoginCookie,
	getCookieToken,
	getJwtToken,
	getClearCookie,
	getLoginCookie,
	getJwtTokenForLogin,
} from '$/lib/auth'
import { sql } from '$/lib/db'

import type { SSRRoute } from '$/types/astro'
import type { Member } from '$/types/db'
import { passwordHashAndSalt } from '$/lib/passwordHashAndSalt'
import { getLogger } from '$/lib/bugsnag'

export async function get({ request }: SSRRoute) {
	return Response.redirect(new URL(`/profile`, request.url))
}

/** @todo Send email when registered successfully (welcome email) */
export async function post({ request }: SSRRoute) {
	const email = getEmailFromLoginCookie(request.headers.get('cookie'))
	if (email == null) {
		return Response.redirect(new URL(`/profile`, request.url))
	}

	const existingMember = (await sql<{ id: number }[]>`SELECT id FROM members WHERE email = ${email}`).pop()
	if (existingMember) {
		return Response.redirect(new URL(`/profile/login`, request.url))
	}

	const formData = await request.formData()
	const publicname = formData.get('publicname')
	const fullname = formData.get('fullname')
	const dob = formData.get('dob')
	const phone = formData.get('phone')
	const password = formData.get('password')
	const confirmPassword = formData.get('confirmPassword')

	const publicnameResult = typeof publicname === 'string' ? publicname.slice(0, 255) : ''
	const fullnameResult = typeof fullname === 'string' ? fullname.slice(0, 255) : ''
	const dobResult =
		typeof dob === 'string' && /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(dob.trim())
			? dob.trim()
			: ''
	const phoneResult = validatePhoneNumber(typeof phone === 'string' ? phone.slice(0, 32) : '')
	const passwordResult =
		typeof password === 'string' && password.length >= 8 && password === confirmPassword ? password : ''

	function redirectBackToForm(
		email: string,
		dialogString: 'create-user-failed' | 'invalid-data' | 'password-failure'
	) {
		const response = Response.redirect(new URL(`/profile/register?dialog=${dialogString}`, request.url))
		const loginToken = getJwtTokenForLogin({
			email,
			publicname: publicnameResult,
			fullname: fullnameResult,
			dob: typeof dob === 'string' ? dob : '',
			phone: phoneResult.isValid ? phoneResult.phoneNumber : typeof phone === 'string' ? phone : '',
			password: typeof password === 'string' ? password : '',
			confirmPassword: typeof confirmPassword === 'string' ? confirmPassword : '',
		})
		response.headers.set('Set-Cookie', getLoginCookie(loginToken))
		return response
	}

	if (
		!publicnameResult ||
		!fullnameResult ||
		!dobResult ||
		(phone !== '' && !phoneResult.isValid) ||
		!passwordResult
	) {
		return redirectBackToForm(email, 'invalid-data')
	}

	return new Promise<Response>((resolve) => {
		getLogger()
		try {
			passwordHashAndSalt(passwordResult).hash(async function (error, hash) {
				if (error || !hash) {
					getLogger().notify(error || new Error(`Password hash failed: ${hash}`))
					return resolve(redirectBackToForm(email, 'password-failure'))
				}

				try {
					const member = (
						await sql<Member[]>`
					INSERT INTO members ("email", "publicname", "fullname", "dob", "phone", "hash")
					VALUES ${sql([email, publicnameResult, fullnameResult, dobResult, phoneResult.phoneNumber, hash])}
					RETURNING *
					`
					).pop()

					if (!member) {
						return resolve(redirectBackToForm(email, 'create-user-failed'))
					}

					const token = getJwtToken(member)
					const response = Response.redirect(new URL(`/profile?dialog=register-completed`, request.url))
					response.headers.append('Set-Cookie', getClearCookie('login'))
					response.headers.append('Set-Cookie', getCookieToken(token))
					return resolve(response)
				} catch (error) {
					if (error instanceof Error) getLogger().notify(error)
					return resolve(redirectBackToForm(email, 'create-user-failed'))
				}
			})
		} catch (error) {
			if (error instanceof Error) getLogger().notify(error)
			return resolve(redirectBackToForm(email, 'create-user-failed'))
		}
	})
}
