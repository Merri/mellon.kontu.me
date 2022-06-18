import { JSX, splitProps } from 'solid-js'

import './Toggle.css'

export interface ToggleProps extends Omit<JSX.IntrinsicElements['input'], 'type'> {
	no?: JSX.Element
	yes?: JSX.Element
}

export function Toggle(props: ToggleProps) {
	const [toggleProps, inputProps] = splitProps(props, ['class', 'no', 'yes'])
	return (
		<>
			<input {...inputProps} class="toggle" aria-hidden="false" hidden type="checkbox" />
			<span class={toggleProps.class} aria-hidden="true">
				<span>{toggleProps.yes ?? 'Yes'}</span>
				<span>{toggleProps.no ?? 'No'}</span>
			</span>
		</>
	)
}
