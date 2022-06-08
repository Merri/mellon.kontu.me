import { getMemberIdFromCookie, getClearCookie, getJwtToken, getCookieToken } from '$/lib/auth'
import { sql } from '$/lib/db'

import type { SSRRoute } from '$/types/astro'
import type { Member } from '$/types/db'
import { passwordHashAndSalt } from '$/lib/passwordHashAndSalt'
import { getLogger } from '$/lib/bugsnag'

export async function get({ request }: SSRRoute) {
	return Response.redirect(new URL(`/profile`, request.url))
}

/** @todo Send email when logged in successfully using a password? (Additional security.) */
export async function post({ request }: SSRRoute) {
	const memberId = getMemberIdFromCookie(request.headers.get('cookie'))

	if (memberId != null) {
		return Response.redirect(new URL(`/profile`, request.url))
	}

	const formData = await request.formData()
	const email = formData.get('email')
	const password = formData.get('password')

	function redirectBackToForm(dialogString: 'login-failed' | 'login-invalid-credentials' | 'login-invalid-email') {
		return Response.redirect(new URL(`/profile?dialog=${dialogString}`, request.url))
	}

	if (typeof email !== 'string' || !email.includes('@') || typeof password !== 'string') {
		return redirectBackToForm('login-invalid-email')
	}

	const member = (await sql<Member[]>`SELECT * FROM members WHERE email = ${email}`).pop()

	if (!member) {
		return redirectBackToForm('login-invalid-credentials')
	}

	if (!member.hash) {
		return redirectBackToForm('login-failed')
	}

	const hash = member.hash

	return new Promise((resolve) => {
		try {
			passwordHashAndSalt(password).verifyAgainst(hash, async function (error, verified) {
				if (error) {
					getLogger().notify(error)
					return resolve(redirectBackToForm('login-failed'))
				}

				if (!verified) {
					return resolve(redirectBackToForm('login-invalid-credentials'))
				}

				const token = getJwtToken(member)
				const response = Response.redirect(new URL(`/profile?dialog=login-completed`, request.url))
				response.headers.append('Set-Cookie', getClearCookie('login'))
				response.headers.append('Set-Cookie', getCookieToken(token))
				return resolve(response)
			})
		} catch (error) {
			if (error instanceof Error) getLogger().notify(error)
			return resolve(redirectBackToForm('login-failed'))
		}
	})
}
