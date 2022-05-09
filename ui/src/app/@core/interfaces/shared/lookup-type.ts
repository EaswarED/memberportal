export interface LookupType {
	id: number;
	name: string;
}

export interface StaffLookupType {
	id: number;
	firstName: string;
	lastName: string;
	bio: string;
}

export interface SessionLookupType {
	id: number;
	name: string;
	programId: number;
}

export interface ClientServiceLookupType {
	remaining: number;
	id: number;
}

export interface ServiceLookupType {
	id: number;
	name: string;
	price: number;
}
