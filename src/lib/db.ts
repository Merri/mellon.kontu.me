import postgres from 'postgres'

if (typeof window !== 'undefined') throw new Error('Server only')

export const sql = postgres({
	host: import.meta.env.POSTGRES_HOST,
	port: import.meta.env.POSTGRES_PORT,
	database: import.meta.env.POSTGRES_DB,
	username: import.meta.env.POSTGRES_USER,
	password: import.meta.env.POSTGRES_PW,
	connection: { timezone: 'UTC' },
})
