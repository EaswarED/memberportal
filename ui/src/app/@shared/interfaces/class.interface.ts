export interface ClassItem {
	Id: number;
	Description: string;
	ImageURL: string;
	ProgramId: number;
	SessionTypeId: number;
	SessionTypeName: string;
	Name: string;
}

export interface ApptItem {
	id: number;
	Description: string;
	ImageURL: string;
	programId: number;
	SessionTypeId: number;
	SessionTypeName: string;
	name: string;
}

export interface ProgramItem {
	id: number;
	name: string;
}
