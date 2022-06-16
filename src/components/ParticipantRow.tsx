import { createSignal } from 'solid-js'
import type { JSX } from 'solid-js'

import { getRegInfo, getRegLevel } from '$/lib/registration'
import type { RegLevelType } from '$/lib/registration'
import { formatPrettyReference } from '$/lib/reference'
import type { Registration } from '$/types/db'

import { CheckPick } from './CheckPick'

interface ParticipantRowProps {
	row: number
	rows: number
	index: number
	memberId: number
	publicname: string | null
	fullname: string | null
	email: string
	phone: string | null
	overnightOptions: string[]
	reg: Registration
	regIndex: number
	numDays: number
	sauna: boolean
}


export function ParticipantRow(props: ParticipantRowProps) {
	const [regLevel, setRegLevel] = createSignal(getRegLevel(props.reg))

	const regInfo = getRegInfo(props.reg)
	const overnightOptions = new Set(props.overnightOptions)

	function indexStyle(): JSX.CSSProperties {
		switch (regLevel()) {
			case 'confirmed':
				return { color: 'var(--link-color)', 'font-weight': 'bold' }
			case 'registered':
				return { color: 'var(--error-color)', 'font-weight': 'bold' }
			case 'cancelled':
				return { opacity: 0.25 }
			default:
				return {}
		}
	}

	return (
		<tr class={props.row & 1 ? 'odd' : 'even'}>
			<td style="text-align:right">
				<span style={indexStyle()}>{props.regIndex + 1}</span>
			</td>
			<td>
				<strong>{props.reg.publicname}</strong>
				<small style="display:block">{regInfo.name}</small>
			</td>
			<td style="text-align:right">{props.reg.age}</td>
			<td style="text-align:center">
				<select
					name={`level[${props.reg.id}]`}
					onChange={(event) => {
						setRegLevel(event.currentTarget.value as RegLevelType)
					}}
				>
					<option value="registered" selected={regLevel() === 'registered'}>
						Ei vahvistettu
					</option>
					<option value="confirmed" selected={regLevel() === 'confirmed'}>
						Osallistuu
					</option>
					<option value="cancelled" selected={regLevel() === 'cancelled'}>
						Ei osallistu
					</option>
					<option value="organizer" selected={regLevel() === 'organizer'}>
						Järjestäjä
					</option>
				</select>
			</td>
			<td hidden={overnightOptions.size < 2} style="text-align:center;white-space:nowrap">
				<small>
					{props.reg.days != null
						? props.reg.days.split(' ').filter((x) => x).length
						: regLevel() === 'cancelled'
						? 0
						: props.numDays}
					pv:{' '}
				</small>
				<select id="overnight" name={`overnight[${props.reg.id}]`}>
					{!overnightOptions.has(regInfo.overnight || '') && (
						<option value="" selected>
							{regInfo.overnight}
						</option>
					)}
					{overnightOptions.has('bed') && (
						<option value="bed" selected={regInfo.overnight === 'bed'}>
							Sänky
						</option>
					)}
					{overnightOptions.has('camping') && (
						<option value="camping" selected={regInfo.overnight === 'camping'}>
							Teltta
						</option>
					)}
					{overnightOptions.has('dailyVisitor') && (
						<option value="dailyVisitor" selected={regInfo.overnight === 'dailyVisitor'}>
							Päivävieras
						</option>
					)}
				</select>
			</td>
			<td hidden={!props.sauna} style="text-align:center">
				<select name={`sauna[${props.reg.id}]`}>
					<option value="none" selected={regInfo.sauna === 'none'}>
						-
					</option>
					<option value="any" selected={regInfo.sauna === 'any'}>
						Seka
					</option>
					<option value="male" selected={regInfo.sauna === 'male'}>
						Miesten
					</option>
					<option value="female" selected={regInfo.sauna === 'female'}>
						Naisten
					</option>
					<option value="family" selected={regInfo.sauna === 'family'}>
						Perhe
					</option>
				</select>
			</td>
			{props.index === 0 && (
				<td rowSpan={props.rows}>
					<a href={`mailto:${props.email}`}>{props.fullname}</a> ({props.publicname})
					<br />
					{props.phone || 'Ei puhelinnumeroa'}
					<br />
					{props.reg.bankReference != null && (
						<span>
							<br />
							Viite:{' '}
							<code style="display:inline-block">{formatPrettyReference(props.reg.bankReference)}</code>
							<br />
							<CheckPick
								checked={props.reg.paid != null}
								name={`paid[${props.reg.id}]`}
								title="Onko maksettu?"
								value="yes"
							>
								Maksettu
							</CheckPick>
						</span>
					)}
				</td>
			)}
		</tr>
	)
}