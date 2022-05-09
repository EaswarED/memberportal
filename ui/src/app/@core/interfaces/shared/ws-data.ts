export interface ReqHeader {
	userId: number;
}

export interface ReqData {
	header: ReqHeader;
	data: any[];
}

export interface RespHeader {
	code: number;
	err: string;
	msg: string;
	totalRecords?: string;
}

export interface RespData {
	status: RespHeader;
	data: any[];
}
