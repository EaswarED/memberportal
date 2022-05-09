import { BaseModel } from '../shared/base-model';

export interface Client {
	emailAddress: string;
	firstName: string;
	lastName: string;
	mindbodyClientId: string;
	chronoPatientId?: string;
	picture?: string;
	groups?: any[];
}
