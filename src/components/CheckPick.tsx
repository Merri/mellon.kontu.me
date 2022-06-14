import { Icon } from './Icon'

// import styles from './Checkpick.module.css'

const styles = {
	checkpick: 'checkpick',
	checkpickCheck: 'checkpickCheck',
	checkpickState: 'checkpickState',
} as const

interface CheckPickProps {
	checked: boolean
	children: string
	name: string
	title: string
	value: string
}

export function CheckPick(props: CheckPickProps) {
	return (
		<label class={styles.checkpick} title={props.title}>
			<input
				class={styles.checkpickState}
				type="checkbox"
				name={props.name}
				value={props.value}
				checked={props.checked}
				aria-hidden="false"
				hidden
			/>
			<span class={styles.checkpickCheck}>
				<Icon href="/icons/check.svg" /> {props.children}
			</span>
		</label>
	)
}
