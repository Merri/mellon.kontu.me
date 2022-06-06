import type { Params } from 'astro'

export interface SSRRoute {
	params: Params
	request: Request
}
