import { defineConfig, ConfigEnv } from 'vite'

const defaultConfig = { build: { target: 'es2020' } }

export default defineConfig(({ mode }: ConfigEnv) => {
	if (!process.argv.includes('--local-development')) {
		return {
			...defaultConfig,
			server: {
				hmr: {
					port: 443,
				},
			},
		}
	}
	return defaultConfig
})
