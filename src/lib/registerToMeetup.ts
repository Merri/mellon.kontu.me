import { formatPrettyReference } from './reference'

interface JoinTextProps {
	bankReference: string | null
	meetupId: number
	organizerName?: string
	url: string
}

export function getJoinText({ bankReference, meetupId, organizerName, url }: JoinTextProps) {
	return `
## Tervehdys Mellonista!

Kiitos, olet ilmoittautunut tapahtumaan!

${bankReference ? `Viitenumerosi maksamista varten: \`${formatPrettyReference(bankReference)}\`` : ''}

Voit milloin tahansa ilmoittautumisten aukioloaikana käydä päivittämässä osallistumisesi osoitteessa
${new URL(`/meetups/registration/${meetupId}`, url)}

${organizerName ? `Terveisin, **${organizerName}**` : ''}

---

Etkö ilmoittautunut miittiin? Käy vaihtamassa salasanasi osoitteessa ${new URL(`/profile`, url)} sekä
perumassa osallistumisesi ylempänä näkyvässä linkissä.
`
}
