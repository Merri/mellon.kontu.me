export interface Meetup {
	id: number
	organizer: 'organization' | 'member' | 'none'
	memberId: number
	organizationId: number | null
	placeId: number
	contactEmail: string | null
	contactUrl: string | null
	title: string
	description: string | null
	participantDescription: string | null
	ageLimit: number
	beds: number
	enableAllergyFields: boolean
	enableCampignMembers: boolean
	enableDailyVisitors: boolean
	enableFamilyMembers: boolean
	enableSaunaOption: boolean
	isFree: boolean
	begin: Date | null
	end: Date | null
	due: Date | null
	open: Date | null
	baseCreditorReference: string
	isFinnishReference: boolean
}

export interface Member {
	id: number
	email: string
	fullname: string | null
	publicname: string | null
	hash: string | null
	phone: string | null
	dob: Date | null
}

export interface Organization {
	id: number
	name: string
	shortDescription: string | null
	url: string | null
	intro: string | null
	history: string | null
	/** Organization owner */
	memberId: number
}

export interface Place {
	id: number
	name: string
	shortDescription: string | null
	description: string | null
	howToGetThere: string | null
	url: string | null
	beds: number | null
	hasKitchen: boolean
	hasSauna: boolean
	streetAddress: string | null
	postalCode: string | null
	location: string | null
	latitude: string | null
	longitude: string | null
}

export interface Registration {
	id: number
	meetupId: number
	memberId: number | null
	publicname: string
	age: number
	info: string | null
	sauna: string | null
	registered: Date | null
	confirmed: Date | null
	bankReference: string
	paid: Date | null
	cancelled: Date | null
	isOrganizer: boolean
}
