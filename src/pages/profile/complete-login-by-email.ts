import { getEmailFromLoginCookie, getCookieToken, getJwtToken, getClearCookie } from '$/lib/auth'
import { sql } from '$/lib/db'

import type { SSRRoute } from '$/types/astro'
import type { Member } from '$/types/db'

export async function get({ request }: SSRRoute) {
	return Response.redirect(new URL(`/profile`, request.url))
}

export async function post({ request }: SSRRoute) {
	const email = getEmailFromLoginCookie(request.headers.get('cookie'))
	if (email == null) {
		return Response.redirect(new URL(`/profile`, request.url))
	}

	const formData = await request.formData()
	const dob = formData.get('dob')

	if (dob == null || typeof dob !== 'string') {
		return Response.redirect(new URL(`/profile/login`, request.url))
	}

	const member = (await sql<Member[]>`SELECT * FROM members WHERE email = ${email} AND dob = ${dob}`).pop()

	if (member == null) {
		return Response.redirect(new URL(`/profile/login?dialog=login-failed`, request.url))
	}

	const token = getJwtToken(member)
	const response = Response.redirect(new URL(`/profile?dialog=login-completed`, request.url))
	response.headers.append('Set-Cookie', getClearCookie('login'))
	response.headers.append('Set-Cookie', getCookieToken(token))
	return response
}
