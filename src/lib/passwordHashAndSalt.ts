import crypto from 'node:crypto'

type HashCallback = (error: Error | null, hash?: string) => void
type VerifyCallback = (error: Error | null, verified?: boolean) => void

interface CalcHashOptions {
	digest?: string
	iterations: number
	password: string
	salt: Buffer
}

interface HashOptions {
	digest?: string
	salt?: string | Buffer
}

function calcHash(callback: HashCallback, { digest = 'sha512', iterations, password, salt }: CalcHashOptions) {
	crypto.pbkdf2(password, salt, iterations, 64, digest, function (error, key) {
		if (error) return callback(error)
		callback(null, `pbkdf2$${iterations}$${key.toString('hex')}$${salt.toString('hex')}$${digest}`)
	})
}

/**
 * Modernized and ported to TypeScript from `happn-password-hash-and-salt`. Dropped support for old versions of crypto.
 *
 * @see https://github.com/happner/password-hash-and-salt
 */
export function passwordHashAndSalt(password: string, iterations = 10000) {
	return {
		hash: function (callback: HashCallback, { digest, salt: rawSalt }: HashOptions = {}) {
			if (!password) return callback(new Error('No password provided'))

			if (rawSalt) {
				const salt = typeof rawSalt === 'string' ? Buffer.from(rawSalt, 'hex') : rawSalt
				return calcHash(callback, { digest, iterations, password, salt })
			}

			crypto.randomBytes(64, function (error, salt) {
				if (error) return callback(error)
				calcHash(callback, { digest, iterations, password, salt })
			})
		},

		verifyAgainst: function (hashedPassword: string, callback: VerifyCallback) {
			if (!hashedPassword || !password) {
				return callback(null, false)
			}

			const [algorithm, iterations, key, salt, digest] = hashedPassword.split('$')

			if (algorithm !== 'pbkdf2') {
				return callback(new Error(`Wrong algorithm: expected pbkdf2, got "${algorithm}"`))
			}

			if (!iterations || !key || !salt) {
				return callback(new Error(`Hash not formatted correctly`))
			}

			if (!parseInt(iterations)) {
				return callback(new Error(`Iterations not stored`))
			}

			// Backwards compatibility with old passwords that did not have digest in their payload
			const hash = `${hashedPassword}${!digest ? '$sha1' : ''}`

			this.hash(
				function (error: Error | null, newHash?: string) {
					if (error) return callback(error)
					callback(null, newHash === hash)
				},
				{ digest: digest || 'sha1', salt }
			)
		},
	}
}
