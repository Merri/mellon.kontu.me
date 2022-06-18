/** @todo Complete this when you have a working SolidJS on dev. */

import { createSignal, JSX, JSXElement, onMount, splitProps } from 'solid-js'

import './ToggleButton.css'

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
	const [local, passthrough] = splitProps(props, [
		'checked',
		'defaultChecked',
		'disabled',
		'no',
		'onChange',
		'onClick',
		'readOnly',
		'ref',
		'value',
		'yes',
	])

	const [internalChecked, setInternalChecked] = createSignal(props.defaultChecked ?? false)
	let button: HTMLButtonElement

	const handleClick: JSX.IntrinsicElements['button']['onClick'] = function handleClick(event) {
		if (typeof local.onClick === 'function') local.onClick(event)
		// Prevent default mutation when readOnly
		if (local.readOnly) event.preventDefault()
	}

	const defaultClick: JSX.IntrinsicElements['button']['onClick'] = function defaultClick(event) {
		handleClick(event)
		if (event.defaultPrevented) return
		setInternalChecked((state) => !state)
	}

	onMount(() => {
		assignProperties(button)
		detectChanges(button)
	})

	return (
		<button
			{...passthrough}
			ref={(ref) => {
				button = ref
				if (typeof local.ref === 'function') {
					local.ref(button)
				} else {
					local.ref = button
				}
			}}
			type="button"
			class="toggleButton"
			role="switch"
			aria-checked={local.checked ?? internalChecked()}
			aria-disabled={local.disabled || undefined}
			aria-readonly={local.readOnly || undefined}
			onChange={local.onChange as JSX.IntrinsicElements['button']['onChange']}
			onClick={local.disabled ? undefined : local.checked == null ? defaultClick : handleClick}
			value={local.checked ?? internalChecked() ? local.value : undefined}
		>
			<span aria-hidden>{local.yes}</span>
			<span aria-hidden>{local.no}</span>
		</button>
	)
}
