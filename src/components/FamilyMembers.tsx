import { createSignal, For, Show } from 'solid-js'

import type { FamilyMember } from '$/types/registrations'

import { Icon } from './Icon'

interface FamilyMemberProps {
	allergy: boolean
	familyMembers: FamilyMember[]
	overnightOptions: 'bed' | 'bed|camping' | 'bed|camping|dailyVisitor' | 'bed|dailyVisitor'
	sauna: boolean
}

export function FamilyMembers(props: FamilyMemberProps) {
	const [members, setMembers] = createSignal<FamilyMember[]>(props.familyMembers.map((x) => ({ ...x })))

	const overnight = new Set(props.overnightOptions.split('|'))

	function addMember() {
		if (members().length < 5) {
			setMembers((members) =>
				members.concat({
					diet: document.querySelector<HTMLInputElement>('#diet')?.value,
					overnight: document.querySelector<HTMLInputElement>('#overnight')?.value,
					sauna: document.querySelector<HTMLInputElement>('#sauna')?.value,
				})
			)
		}
	}

	return (
		<div class="family-members">
			<h3>Perheenjäsenet</h3>
			<p>Voit ilmoittaa itsesi lisäksi viisi perheenjäsentä.</p>
			<For each={members()}>
				{(member) => (
					<div class="family-member">
						<input type="hidden" name="id[]" value={member.id || ''} />
						<p class="form-field">
							<label>
								Nimi ilmoittautumislistalla:
								<input type="text" name="publicname[]" value={member.publicname || ''} />
							</label>
						</p>
						<p class="form-field">
							<label>
								Nimi:
								<input type="text" name="name[]" value={member.name || ''} />
							</label>
						</p>
						<p class="form-field">
							<label>
								Ikä:
								<input type="number" min={0} max={125} name="age[]" value={member.age ?? 9} />
							</label>
							<small>Ikä tapahtuman alkamispäivänä.</small>
						</p>
						<Show when={props.sauna}>
							<p class="form-field">
								<label>
									Saunavuorot:
									<select name="sauna[]">
										<option value="any" selected={member.sauna === 'any'}>
											Sekavuoro
										</option>
										<option value="male" selected={member.sauna === 'male'}>
											Miestenvuoro
										</option>
										<option value="female" selected={member.sauna === 'female'}>
											Naistenvuoro
										</option>
										<option value="family" selected={member.sauna === 'family'}>
											Oma vuoro / perhevuoro
										</option>
										<option value="none" selected={member.sauna === 'none'}>
											En sauno
										</option>
									</select>
								</label>
							</p>
						</Show>
						<Show when={overnight.size > 1}>
							<p class="form-field">
								<label>
									Yöpyminen:
									<select name="overnight[]">
										<option value="bed" selected={member.overnight === 'bed'}>
											Nukkuu sängyssä
										</option>
										{overnight.has('camping') && (
											<option value="camping" selected={member.overnight === 'camping'}>
												Nukkuu teltassa
											</option>
										)}
										{overnight.has('dailyVisitor') && (
											<option value="dailyVisitor" selected={member.overnight === 'dailyVisitor'}>
												Päivävierailija
											</option>
										)}
									</select>
								</label>
							</p>
						</Show>
						<p class="form-field">
							<label>
								Ruokavalio:
								<select name="diet[]" autocomplete="off">
									<option value="none" selected={member.diet === 'none'}>
										Ei osallistu yhteisruokailuihin
									</option>
									<option value="all" selected={member.diet === 'all'}>
										Kaikki käy
									</option>
									<option value="semivegetarian" selected={member.diet === 'semivegetarian'}>
										Semivegetaarinen
									</option>
									<option value="lacto-ovarian" selected={member.diet === 'lacto-ovarian'}>
										Lakto-ovovegetaarinen
									</option>
									<option value="lactovegetarian" selected={member.diet === 'lactovegetarian'}>
										Laktovegetaarinen
									</option>
									<option value="pescovegetarian" selected={member.diet === 'pescovegetarian'}>
										Pescovegetaarinen
									</option>
									<option value="vegan" selected={member.diet === 'vegan'}>
										Vegaani
									</option>
								</select>
							</label>
						</p>
						<Show when={props.allergy}>
							<p class="form-field">
								<label>
									Allergiat:
									<textarea name="allergies[]" autocomplete="off" cols={40}>
										{member.allergies || ''}
									</textarea>
								</label>
							</p>
						</Show>
						<p class="form-field">
							<label>
								Lisätietoja:
								<textarea name="info[]" cols={40}>
									{member.info || ''}
								</textarea>
							</label>
						</p>
					</div>
				)}
			</For>
			<p class="family-member-addition">
				<button class="button-alt" type="button" onclick={addMember} disabled={members().length >= 5}>
					Lisää
					<Icon href="/icons/user-2.svg" />
				</button>
			</p>
		</div>
	)
}
