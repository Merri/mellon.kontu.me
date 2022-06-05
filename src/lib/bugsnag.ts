import Bugsnag from '@bugsnag/js'

let started = false

export function getLogger() {
	if (!started && import.meta.env.BUGSNAG_API_KEY) {
		Bugsnag.start({ apiKey: import.meta.env.BUGSNAG_API_KEY })
		started = true
	}
	return Bugsnag
}
