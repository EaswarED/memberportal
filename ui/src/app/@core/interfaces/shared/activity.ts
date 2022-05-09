import { BaseModel } from './base-model';

export interface ActivityModel extends BaseModel {
	activityName: string;
	activityType: string;
	startDate?: string;
	startTime?: string;
	endDate?: string;
	endTime?: string;
	staffName?: string;
}
