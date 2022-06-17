import { createSignal, JSX, JSXElement, onMount } from 'solid-js'

export interface HTMLSwitchElement extends HTMLButtonElement {
	checked: HTMLInputElement['checked']
	readOnly: HTMLInputElement['readOnly']
}

/** Provide `checked` and `readOnly` properties like a native input would. Override `disabled` to maintain unified functionality. */
function assignProperties(button?: ToggleProps['ref']) {
	;['checked', 'disabled', 'readOnly'].forEach((propName) => {
		const attrName = `aria-${propName.toLowerCase()}`
		Object.defineProperty(button, propName, {
			get: function () {
				return this.getAttribute(attrName) === 'true'
			},
			set: function (value) {
				// Match React rendering of the attributes
				if (value || propName === 'checked') {
					// `aria-checked` always exists
					this.setAttribute(attrName, value ? 'true' : 'false')
				} else {
					// `aria-disabled` and `aria-readonly` are removed
					this.removeAttribute(attrName)
				}
			},
		})
	})
}

/** Notice when `checked` changes by listening to the `aria-checked` attribute mutations. */
function detectChanges(element?: ToggleProps['ref']) {
	if (!element || !(element instanceof HTMLButtonElement)) return

	const observer = new MutationObserver((mutationsList) => {
		for (const mutation of mutationsList) {
			if (mutation.type === 'attributes') {
				// This is enough to do this for the native DOM
				const event = new Event('change', { bubbles: true })
				mutation.target.dispatchEvent(event)
				console.log('it happens, change')
			}
		}
	})

	observer.observe(element, { attributes: true, attributeFilter: ['aria-checked'] })

	return () => {
		observer.disconnect()
	}
}

/*
export interface ToggleProps
	extends Omit<
		JSX.IntrinsicElements['button'],
		'aria-checked' | 'aria-disabled' | 'aria-readonly' | 'onChange' | 'role' | 'type'
	> {
	checked?: boolean
	defaultChecked?: boolean
	onChange?: JSX.EventHandler<HTMLSwitchElement, Event>
	no?: JSXElement
	readOnly?: boolean
	yes?: JSXElement
}

export function Toggle(props: ToggleProps) {
	const [internalChecked, setInternalChecked] = createSignal(props.defaultChecked ?? false)

	const handleClick: JSX.IntrinsicElements['button']['onClick'] = function handleClick(event) {
		if (props.onClick) props.onClick(event)
		// Prevent default mutation when readOnly
		if (props.readOnly) event.preventDefault()
	}

	const defaultClick: JSX.IntrinsicElements['button']['onClick'] = function defaultClick(event) {
		console.log('props.ref', props.ref, props.ref instanceof HTMLButtonElement)
		handleClick(event)
		if (event.defaultPrevented) return
		setInternalChecked((state) => !state)
	}

	onMount(() => {
		assignProperties(props.ref)
		detectChanges(props.ref)
	})

	return (
		<button
			{...props}
			type="button"
			class="toggle"
			role="switch"
			aria-checked={props.checked ?? internalChecked()}
			aria-disabled={props.disabled || undefined}
			aria-readonly={props.readOnly || undefined}
			onChange={props.onChange as JSX.IntrinsicElements['button']['onChange']}
			onClick={props.disabled ? undefined : props.checked == null ? defaultClick : handleClick}
			value={props.value}
		>
			<span aria-hidden>{props.yes}</span>
			<span aria-hidden>{props.no}</span>
		</button>
	)
}
*/

export interface ToggleProps extends Omit<JSX.IntrinsicElements['input'], 'type'> {
	no?: JSX.Element
	yes?: JSX.Element
}

export function Toggle(props: ToggleProps) {
	return (
		<>
			<input {...props} class="toggle" aria-hidden="false" hidden type="checkbox" />
			<span aria-hidden="true">
				<span>{props.yes ?? 'Yes'}</span>
				<span>{props.no ?? 'No'}</span>
			</span>
		</>
	)
}
