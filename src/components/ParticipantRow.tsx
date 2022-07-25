import { createSignal } from 'solid-js'
import type { JSX } from 'solid-js'

import { getRegLevel, RegInfo } from '$/lib/registration'
import type { RegLevelType } from '$/lib/registration'
import { formatPrettyReference } from '$/lib/reference'
import type { Registration } from '$/types/db'

import { Toggle } from './atoms/Toggle'

interface ParticipantRowProps extends Pick<RegInfo, 'name' | 'overnight' | 'sauna' > {
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
	hasSauna: boolean
	hasWhatsApp: boolean
	allowWhatsApp: boolean
}

export function ParticipantRow(props: ParticipantRowProps) {
	const [regLevel, setRegLevel] = createSignal(getRegLevel(props.reg))

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
				<small style="display:block">{props.name}</small>
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
					{!overnightOptions.has(props.overnight || '') && (
						<option value="" selected>
							{props.overnight}
						</option>
					)}
					{overnightOptions.has('bed') && (
						<option value="bed" selected={props.overnight === 'bed'}>
							Sänky
						</option>
					)}
					{overnightOptions.has('camping') && (
						<option value="camping" selected={props.overnight === 'camping'}>
							Teltta
						</option>
					)}
					{overnightOptions.has('dailyVisitor') && (
						<option value="dailyVisitor" selected={props.overnight === 'dailyVisitor'}>
							Päivävieras
						</option>
					)}
				</select>
			</td>
			<td hidden={!props.hasSauna} style="text-align:center">
				<select name={`sauna[${props.reg.id}]`}>
					<option value="none" selected={props.sauna === 'none'}>
						-
					</option>
					<option value="any" selected={props.sauna === 'any'}>
						Seka
					</option>
					<option value="male" selected={props.sauna === 'male'}>
						Miesten
					</option>
					<option value="female" selected={props.sauna === 'female'}>
						Naisten
					</option>
					<option value="family" selected={props.sauna === 'family'}>
						Perhe
					</option>
				</select>
			</td>
			{props.index === 0 && (
				<td rowSpan={props.rows}>
					<a href={`mailto:${props.email}`}>{props.fullname}</a> ({props.publicname})
					<br />
					{props.phone || 'Ei puhelinnumeroa'}
					{props.hasWhatsApp && props.allowWhatsApp && ` (WhatsApp OK!)`}
					<br />
					{props.reg.bankReference != null && (
						<span>
							<br />
							Viite:{' '}
							<code style="display:inline-block">{formatPrettyReference(props.reg.bankReference)}</code>
							<br />
							<label>
								Maksettu?{' '}
								<Toggle
									checked={props.reg.paid != null}
									name={`paid[${props.reg.id}]`}
									no="Ei"
									yes="On"
									value="yes"
								/>
							</label>
						</span>
					)}
				</td>
			)}
		</tr>
	)
}
