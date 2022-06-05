export function getPermalink(canonical: URL, fixPathname?: string) {
	return `${fixPathname ? new URL(fixPathname, canonical.origin) : canonical}`.replace(/\/$/, '')
}
