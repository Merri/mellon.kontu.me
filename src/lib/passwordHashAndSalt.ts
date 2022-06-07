import crypto from 'crypto'

type Callback = (error: Error | string | null, hash?: string) => void

function getFunctionParameters(fn: typeof crypto.pbkdf2) {
	const args: any[] = []
	const FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m
	const FN_ARG_SPLIT = /,/
	const FN_ARG = /^\s*(_?)(.+?)\1\s*$/
	const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm

	if (typeof fn === 'function') {
		const fnText = fn.toString().replace(STRIP_COMMENTS, '')
		const argDecl = fnText.match(FN_ARGS)

		argDecl?.[1].split(FN_ARG_SPLIT).forEach(function (arg) {
			arg.replace(FN_ARG, function (_all, _underscore, name) {
				args.push(name)
				return ''
			})
		})

		return args
	} else {
		return null
	}
}

/**
 * Ported to TypeScript from happn-password-hash-and-salt
 *
 * @see https://github.com/happner/password-hash-and-salt
 * */
export function passwordHashAndSalt(password: string, iterations = 10000) {
	function calcHash(callback: Callback, salt: Buffer, digest = 'sha512') {
		const params = getFunctionParameters(crypto.pbkdf2) || []
		const hasDigest = params.length > 5

		if (!hasDigest) {
			digest = 'sha1'
			// @ts-ignore
			crypto.pbkdf2(password, salt, iterations, 64, function (err, key) {
				if (err) return callback(err)
				callback(null, `pbkdf2$${iterations}$${key.toString('hex')}$${salt.toString('hex')}$${digest}`)
			})
		} else {
			crypto.pbkdf2(password, salt, iterations, 64, digest, function (err, key) {
				if (err) return callback(err)
				callback(null, `pbkdf2$${iterations}$${key.toString('hex')}$${salt.toString('hex')}$${digest}`)
			})
		}
	}

	return {
		hash: function (callback: Callback, options: { digest?: string; salt?: string | Buffer } = {}) {
			if (!password) return callback('No password provided')

			if (!options.salt) {
				crypto.randomBytes(64, function (err, gensalt) {
					if (err) return callback(err)
					calcHash(callback, gensalt, options.digest)
				})
			} else {
				calcHash(
					callback,
					typeof options.salt === 'string' ? Buffer.from(options.salt, 'hex') : options.salt,
					options.digest
				)
			}
		},

		verifyAgainst: function (
			hashedPassword: string,
			callback: (error: string | Error | null, verified?: boolean) => void
		) {
			if (!hashedPassword || !password) {
				return callback(null, false)
			}

			const key = hashedPassword.split('$')

			if (key.length < 4 || !key[2] || !key[3]) {
				return callback('Hash not formatted correctly')
			}

			if (key[0] !== 'pbkdf2') {
				return callback('Wrong algorithm')
			}

			iterations = parseInt(key[1])
			if (!iterations) {
				return callback('Iterations not stored')
			}

			// backward compatible with previous passwords
			let hashedPasswordDigest = 'sha1'
			// decouple in case we need to add anything
			let checkAgainst = hashedPassword.toString()

			if (key[4]) {
				hashedPasswordDigest = key[4]
			} else {
				checkAgainst += '$sha1'
			}

			this.hash(
				function (error: string | Error | null, newHash?: string) {
					if (error) return callback(error)
					callback(null, newHash === checkAgainst)
				},
				{ digest: hashedPasswordDigest, salt: key[3] }
			)
		},
	}
}
