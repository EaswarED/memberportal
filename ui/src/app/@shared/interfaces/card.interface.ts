export interface CardItem {
	// New Values...
	Id: string;
	Name: string;
	BookingId: number;
	StartDateTime: string;
	AppointmentStatus: string;
	IsPending: boolean;
	IsApproved: boolean;

	// TODO: Remove all old fields...
	id: string;
	name: string;
	classId: number;
	progId: number;
	sessionId: number;
}

export interface CardData {
	title: string;
	items: CardItem[];
}
