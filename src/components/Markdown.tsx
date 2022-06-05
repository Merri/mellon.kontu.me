import SolidMarkdown from 'solid-markdown'

export function Markdown({ children }: { children?: string | null }) {
	return <SolidMarkdown children={children || undefined} />
}
