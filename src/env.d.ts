/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly POSTGRES_HOST: string
	readonly POSTGRES_PORT: number
	readonly POSTGRES_DB: string
	readonly POSTGRES_USER: string
	readonly POSTGRES_PW: string

	readonly BUGSNAG_API_KEY: string
	readonly JWT_DATABASE: string
	readonly JWT_SECRET: string
	readonly TOMTOM_API_KEY: string

	readonly PRIMARY_EMAIL_HOST: string
	readonly PRIMARY_EMAIL_PORT: number
	readonly PRIMARY_EMAIL_NAME: string
	readonly PRIMARY_EMAIL_FROM: string
	readonly PRIMARY_EMAIL_USER: string
	readonly PRIMARY_EMAIL_PW: string

	readonly SENDGRID_API_KEY: string

	readonly SECONDARY_EMAIL_HOST: string
	readonly SECONDARY_EMAIL_PORT: number
	readonly SECONDARY_EMAIL_NAME: string
	readonly SECONDARY_EMAIL_FROM: string
	readonly SECONDARY_EMAIL_USER: string
	readonly SECONDARY_EMAIL_PW: string

	readonly PREVIEW?: 'true'
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
