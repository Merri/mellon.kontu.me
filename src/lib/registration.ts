import JWT from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'

import type { Registration } from '$/types/db'

export type RegLevelType = 'organizer' | 'cancelled' | 'confirmed' | 'registered' | 'added'

export function getRegLevel(reg: Registration): RegLevelType {
	if (reg.isOrganizer) return 'organizer'
	if (reg.cancelled != null) return 'cancelled'
	if (reg.confirmed != null) return 'confirmed'
	if (reg.registered != null) return 'registered'
	return 'added'
}

export interface RegInfo extends JwtPayload {
	name?: string
	info?: string
	overnight?: string
	allergies?: string
	diet?: string
	sauna?: string
}

export interface FullReg extends Omit<Registration, 'info'> {
	info: RegInfo
}

export const getRegInfo = function getRegInfo(reg: Registration): RegInfo {
	if (reg.info) {
		try {
			const payload = JWT.verify(reg.info, import.meta.env.JWT_DATABASE, { algorithms: ['HS256'] })
			if (typeof payload !== 'string') return payload
		} catch (error) {}
	}

	return {}
}
