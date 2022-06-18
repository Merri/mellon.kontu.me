import type { Meetup } from '$/types/db'
import { formatPrettyReference } from './reference'

interface RegCompleteProps {
	bankReference: string | null
	meetup: Meetup
	organizerName?: string
	url: string
}

export function getRegistrationCompletedText({ bankReference, meetup, organizerName, url }: RegCompleteProps) {
	return `
## Tervehdys Mellonista!

Kiitos että osallistut tapahtumaan!

${bankReference ? `Viitenumerosi maksamista varten: \`${formatPrettyReference(bankReference)}\`` : ''}

Voit milloin tahansa ilmoittautumisten aukioloaikana käydä päivittämässä osallistumisesi osoitteessa
${new URL(`/meetups/registration/${meetup.id}`, url)}

${organizerName ? `Terveisin, **${organizerName}**` : ''}

---

${meetup.description || ''}

${meetup.participantDescription || ''}

---

Tuliko tämä viesti odottamatta ja et olekaan ilmoittautunut miittiin? Käy vaihtamassa salasanasi osoitteessa
${new URL(`/profile`, url)} sekä perumassa osallistumisesi.
`
}
