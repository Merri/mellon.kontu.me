import { defineConfig } from 'astro/config'
import deno from '@astrojs/deno'
import node from '@astrojs/node'
import solid from '@astrojs/solid-js'
import vercel from '@astrojs/vercel/serverless'

export default defineConfig({
	adapter: (process.argv.includes('--deno') && deno()) || (process.argv.includes('--node') && node()) || vercel(),
	integrations: [solid()],
	site: 'https://mellon.kontu.me',
})
