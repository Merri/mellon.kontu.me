import { format, utcToZonedTime } from 'date-fns-tz'
import locale from 'date-fns/locale/fi'

import type { Meetup } from '$/types/db'

const tz = 'Europe/Helsinki'

const formatOptions = { locale, timeZone: tz }

export function getYmdUTC() {
	return format(new Date(), 'yyyy-MM-dd')
}

export function meetupToZonedTime(meetup: Meetup) {
	if (meetup.begin) meetup.begin = utcToZonedTime(meetup.begin, 'Europe/Helsinki')
	if (meetup.due) meetup.due = utcToZonedTime(meetup.due, 'Europe/Helsinki')
	if (meetup.end) meetup.end = utcToZonedTime(meetup.end, 'Europe/Helsinki')
	if (meetup.open) meetup.open = utcToZonedTime(meetup.open, 'Europe/Helsinki')
	return meetup
}
