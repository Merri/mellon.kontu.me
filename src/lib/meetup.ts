import { isBefore, endOfDay, isSameDay, addMinutes, isSameYear } from 'date-fns'
import { format as tzf } from 'date-fns-tz'
import locale from 'date-fns/locale/fi/index.js'

import type { Meetup, Member } from '$/types/db'

import { asFinnishRefNumber } from './reference'
import { isString } from './types'

interface MeetupDateOptions {
	format: string
	now: Date
	meetup?: Meetup
}

const opts = { locale, timeZone: 'Europe/Helsinki' }

export function getOvernightOptions(meetup?: Meetup): string[] {
	if (!meetup) return []
	if (!meetup.begin || !meetup.end) return []
	if (isSameDay(meetup.begin, meetup.end)) return []
	return ['bed', meetup.enableDailyVisitors && 'dailyVisitor', meetup.enableCampingMembers && 'camping'].filter(
		isString
	)
}

export function getMeetupBankReference({ meetup, member, now }: { meetup: Meetup; member: Member; now: Date }) {
	if (meetup.isFree) return null

	if (meetup.baseCreditorReference) {
		return asFinnishRefNumber(BigInt(meetup.baseCreditorReference) + BigInt(member.id))
	}

	return asFinnishRefNumber(
		((BigInt(300000) + BigInt(meetup.id % 1000)) * BigInt(100000) + BigInt(member.id % 100000)) * BigInt(100) +
			BigInt(now.getFullYear() % 100)
	)
}

/** Get registration closing date */
export function getRegistrationCloseDate(meetup?: Meetup): Date | null {
	if (!meetup) return null
	return meetup.begin
		? meetup.end
			? isSameDay(meetup.begin, meetup.end)
				? addMinutes(meetup.begin, -5)
				: endOfDay(meetup.begin)
			: meetup.begin
		: null
}

/** Get registration closing date as string if it is in the future */
export function getTextRegistrationClose({ format, now, meetup }: MeetupDateOptions): string | null {
	const closeDate = getRegistrationCloseDate(meetup)
	if (!closeDate || isBefore(closeDate, now)) return null
	return tzf(closeDate, format, opts)
}

/** `EEEE d.M.Y 'klo' H:mm` */

/** Get registration opening date as string if it is in the future */
export function getTextRegistrationOpen({ format, now, meetup }: MeetupDateOptions): string | null {
	if (!meetup?.open || isBefore(meetup.open, now)) return null
	return tzf(meetup.open, format, opts)
}

export function getTextMeetupDateRange(meetup?: Meetup): string | null {
	if (!meetup) return null
	if (meetup.begin == null) {
		if (meetup.end == null) return 'Ajankohta ei tiedossa'
		return tzf(meetup.end, `'Päättyy' EEEEEE d.M.Y 'klo' H:mm (alkamisaika ei tiedossa)`, opts)
	}

	if (meetup.end == null) {
		return tzf(meetup.begin, `'Alkaa' EEEEEE d.M.Y 'klo' H:mm '(päättymisaika ei tiedossa)'`, opts)
	}

	if (isSameDay(meetup.begin, meetup.end)) {
		return tzf(meetup.begin, `EEEEEE d.M.Y 'klo' H:mm '\u2013' `, opts) + tzf(meetup.end, `H:mm`, opts)
	}

	if (isSameYear(meetup.begin, meetup.end)) {
		return (
			tzf(meetup.begin, `EEEEEE d.M. 'klo' H:mm '\u2013' `, opts) +
			tzf(meetup.end, `EEEEEE d.M.Y 'klo' H:mm`, opts)
		)
	}

	return (
		tzf(meetup.begin, `EEEEEE d.M.Y 'klo' H:mm '\u2013' `, opts) + tzf(meetup.end, `EEEEEE d.M.Y 'klo' H:mm`, opts)
	)
}
