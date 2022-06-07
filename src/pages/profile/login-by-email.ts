import { marked } from 'marked'

import { getMemberIdFromCookie, getClearCookie, getJwtTokenForLogin } from '$/lib/auth'
import { sql } from '$/lib/db'
import { getMemberEmailField, sendMail } from '$/lib/email'

import type { SSRRoute } from '$/types/astro'
import type { Member } from '$/types/db'

export async function get({ request }: SSRRoute) {
	return Response.redirect(new URL(`/profile`, request.url))
}

function getNewUserText(url: string, token: string) {
	return `
## Tervehdys Mellonista!

Luo itsellesi tunnus käyttäen tätä linkkiä: ${new URL(`/profile/login/${token}`, url)}

Linkki on voimassa noin kaksi tuntia.

---

Jos et ole pyytänyt tunnuksen luontia Melloniin, niin voit jättää tämän viestin huomiotta.
`
}
function getExistingUserText(url: string, token: string) {
	return `
## Tervehdys Mellonista!

Kirjaudu tällä linkillä: ${new URL(`/profile/login/${token}`, url)}

Linkki on voimassa noin kaksi tuntia.

---

Jos et ole pyytänyt kirjautumista Melloniin, niin voit jättää tämän viestin huomiotta.
`
}

export async function post({ request }: SSRRoute) {
	const memberId = getMemberIdFromCookie(request.headers.get('cookie'))

	if (memberId != null) {
		return Response.redirect(new URL(`/profile`, request.url))
	}

	const email = (await request.formData()).get('email')

	if (typeof email !== 'string' || !email.includes('@')) {
		return Response.redirect(new URL(`/profile?dialog=login-invalid-email`, request.url))
	}

	const member = (await sql<Member[]>`SELECT * FROM members WHERE email = ${email}`).pop()
	const token = getJwtTokenForLogin({ email })

	const text = member ? getExistingUserText(request.url, token) : getNewUserText(request.url, token)
	const subject = member ? 'Kirjautumislinkki Melloniin' : 'Linkki tunnuksen luontiin Melloniin'
	const to = member ? getMemberEmailField(member) : email

	sendMail({
		to,
		subject,
		text,
		html: marked.parse(text),
	})

	const response = Response.redirect(new URL(`/profile?dialog=login-link-email-sent`, request.url))
	response.headers.set('Set-Cookie', getClearCookie('token'))
	return response
}
