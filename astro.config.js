import { defineConfig } from 'astro/config'
import deno from '@astrojs/deno'
import node from '@astrojs/node'
import solid from '@astrojs/solid-js'
import vercel from '@astrojs/vercel/serverless'

const isDeno = process.argv.includes('--deno')
const isNode = !isDeno && process.argv.includes('--node')
const isVercel = !isDeno && !isNode

export default defineConfig({
	adapter: (isDeno && deno()) || (isNode && node()) || vercel(),
	integrations: [solid()],
	output: 'server',
	site: 'https://mellon.kontu.me',
	vite: {
		optimizeDeps: {
			exclude: ['postgres'],
		},
	},
})
