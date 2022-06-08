import { getJwtPayloadFromCookie, getClearCookie } from '$/lib/auth'

import type { SSRRoute } from '$/types/astro'

export async function get({ request }: SSRRoute) {
	return Response.redirect(new URL(`/profile`, request.url))
}

export async function post({ request }: SSRRoute) {
	const payload = getJwtPayloadFromCookie(request.headers.get('cookie'))

	if (payload != null) {
		const response = Response.redirect(new URL(`/profile?dialog=logged-out`, request.url))
		response.headers.append('Set-Cookie', getClearCookie('login'))
		response.headers.append('Set-Cookie', getClearCookie('token'))
		return response
	}

	return Response.redirect(new URL(`/profile`, request.url))
}
