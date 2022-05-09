export interface DropdownType extends Base {
	isSelected?: boolean;
	parentName?: string;
}

export interface BaseModel extends Base {
	description?: string;
	clientId: string;
	staffId: string;
	orderNr?: number;
	statusIn?: string;
	property1?: string;
	property2?: string;
	property3?: string;
	totalChildCnt?: number;
}

export interface Base {
	id: number;
	name: string;
}
