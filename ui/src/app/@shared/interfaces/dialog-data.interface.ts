export interface CreateAppointment {
	appCatCtrl: number;
	appTypeCtrl: number;
	appProviderCtrl: number;
	nameOncardCtrl: string;
	cardNumberCtrl: number;
	expiryCtrl: number;
	cvvCtrl: number;
}

export interface DialogData {
	name: string;
	item: [];
	onApptCount?: number;
	onClassCount?: number;
	onGroupCount?: number;
}

export interface DialogItem {
	type: string;
	name: string;
	code: string;
}
