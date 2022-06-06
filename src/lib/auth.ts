import cookie from 'cookie'
import { addHours, addYears } from 'date-fns'
import JWT from 'jsonwebtoken'

import { getLogger } from '$/lib/bugsnag'
import type { Member } from '$/types/db'

/** Main token for authentication. */
export function getJwtToken(member: Member) {
	return JWT.sign({ id: member.id, duration: 'year' }, import.meta.env.JWT_SECRET, {
		algorithm: 'HS256',
		expiresIn: '1y',
	})
}

/** Token for email login. */
export function getJwtTokenForEmail(email: string) {
	return JWT.sign({ email }, import.meta.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '2h' })
}

export function getJwtPayload(token: string) {
	try {
		const decoded = JWT.verify(token, import.meta.env.JWT_SECRET, { algorithms: ['HS256'] })

		if (decoded) {
			if (typeof decoded !== 'string') {
				return decoded
			} else {
				getLogger().notify(new Error(`Invalid JWT, string: ${decoded}`))
			}
		} else {
			getLogger().notify(new Error(`Empty JWT, typeof: ${typeof decoded}`))
		}
	} catch (error) {
		getLogger().notify(error instanceof Error ? error : new Error('JWT error'))
	}

	return null
}

export function getJwtPayloadFromCookie(cookieString: string | null): null | JWT.JwtPayload {
	if (!cookieString) return null
	const { token } = cookie.parse(cookieString)
	return token ? getJwtPayload(token) : null
}

export function getMemberIdFromCookie(cookieString: string | null): null | number {
	const payload = getJwtPayloadFromCookie(cookieString)
	if (!payload) return null

	if (typeof payload.id === 'number') {
		return payload.id
	} else {
		getLogger().notify(new Error(`Invalid JWT payload, id is not a number: ${typeof payload.id}`))
		return null
	}
}

export function getLoginCookieToken(loginCookie: string | null): null | string {
	if (!loginCookie) return null
	const { login } = cookie.parse(loginCookie)
	return login || null
}

export function getEmailFromLoginCookie(loginCookie: string | null): null | string {
	const login = getLoginCookieToken(loginCookie)
	const payload = login ? getJwtPayload(login) : null
	if (!payload) return null

	if (typeof payload.email === 'string') {
		return payload.email
	} else {
		getLogger().notify(new Error(`Invalid JWT payload, email is not a string: ${typeof payload.email}`))
		return null
	}
}

/** Set-Cookie value for logout. */
export function getClearCookie(itemToClear: 'login' | 'token') {
	return cookie.serialize(itemToClear, '', { expires: addYears(new Date(), -1), path: '/' })
}

/** Set-Cookie value used before successful login. */
export function getLoginCookie(token: string) {
	const payload = getJwtPayload(token)
	return cookie.serialize('login', token, {
		expires: payload?.exp ? new Date(payload.exp * 1000) : addHours(new Date(), 1),
		path: '/',
	})
}

/** Set-Cookie value used for successful login. */
export function getCookieToken(token: string) {
	const payload = getJwtPayload(token)
	return cookie.serialize('token', token, {
		expires: payload?.exp ? new Date(payload.exp * 1000) : addYears(new Date(), 1),
		path: '/',
	})
}
