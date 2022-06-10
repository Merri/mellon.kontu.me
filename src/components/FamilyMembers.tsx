import { createSignal, For } from 'solid-js'

import type { FamilyMember } from '$/types/registrations'

import { Icon } from './Icon'

interface FamilyMemberProps {
	familyMembers: FamilyMember[]
}

export function FamilyMembers(props: FamilyMemberProps) {
	const [members, setMembers] = createSignal<FamilyMember[]>(props.familyMembers.map((x) => ({ ...x })))

	function addMember() {
		if (members().length < 5) setMembers((members) => members.concat({}))
	}

	return (
		<div>
			<p>Voit ilmoittaa itsesi lisäksi viisi perheenjäsentä.</p>
			<For each={members()}>
				{(member) => (
					<div class="family-member">
						<p class="form-field">
							<label>
								Julkinen nimi:
								<input type="text" name="publicname[]" value={member.publicname} />
							</label>
						</p>
					</div>
				)}
			</For>
			<p>
				<button class="button-alt" type="button" onclick={addMember} disabled={members().length >= 5}>
					<Icon href="/icons/plus.svg" />
					Lisää
				</button>
			</p>
		</div>
	)
}
