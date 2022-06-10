interface IconProps {
	color?: string
	darkColor?: string
	href: string
	lightColor?: string
	size?: number
	shadeColor?: string
	strokeColor?: string
	title?: string
}

export function Icon(props: IconProps) {
	const { color, darkColor, href, lightColor, shadeColor, size = 1.5, strokeColor, title } = props

	let style = ''
	if (color) style += `--icon-color:${color};`
	if (darkColor) style += `--icon-dark-color:${darkColor};`
	if (lightColor) style += `--icon-light-color:${lightColor};`
	if (shadeColor) style += `--icon-shade-color:${shadeColor};`
	if (strokeColor) style += `--icon-stroke-color:${strokeColor};`

	return (
		<svg
			aria-hidden={!title || undefined}
			class="icon"
			width={size * 16}
			height={size * 16}
			style={style || undefined}
		>
			{title && <title>${title}</title>}
			<use href={`${href}#icon`} />
		</svg>
	)
}
