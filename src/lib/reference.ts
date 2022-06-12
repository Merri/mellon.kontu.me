const finCheckSumTable = [0, 7, 0, 1, 0, 0, 0, 3]

export function asFinnishRefNumber(number: string | BigInt): string | null {
	const ref = typeof number === 'string' ? number.replace(/\D+/g, '') : `${number}`

	if (ref.length < 3 || ref.length > 19 || (typeof number === 'string' && ref !== number.replace(/ /g, ''))) {
		return null
	}

	let checkSum = 0
	let i = ref.length - 1
	let j = 7

	while (i >= 0) {
		checkSum += j * (ref.charCodeAt(i) & 15)
		j = finCheckSumTable[j]
		i--
	}

	checkSum = (10 - (checkSum % 10)) % 10

	return `${ref}${checkSum}`
}

export function isValidFinnishRefNumber(number: string | BigInt) {
	if (typeof number !== 'string') {
		return false
	}

	const ref = typeof number === 'string' ? number.replace(/ /g, '') : `${number}`
	return ref === asFinnishRefNumber(ref.slice(0, ref.length - 1))
}

/**
 * Formats characters to groups of five or four, allowing first group to be three to six characters in length.
 */
export function formatPrettyReference(number: string | BigInt) {
	if (typeof number !== 'string') {
		number = `${number}`
	}

	if (number.length === 0) {
		return number
	}

	const ref = number.replace(/ /g, '')
	const len = ref.length
	const five = len % 5
	const l = five === 0 || five > 2 || (len % 4 === 1 && five !== 2) ? 5 : 4

	let i = 0
	let out = ''

	for (i = len - l; i > 0; i -= l) {
		out = ' ' + ref.substring(i, i + l) + out
	}

	i = i + l

	return ref.slice(0, i) + (i < 3 ? out.slice(1) : out)
}
