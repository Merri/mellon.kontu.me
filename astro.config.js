import { defineConfig } from 'astro/config'
import solid from '@astrojs/solid-js'
import vercel from '@astrojs/vercel/serverless'

export default defineConfig({
	adapter: vercel(),
	integrations: [solid()],
	site: 'https://mellon.kontu.me',
})
