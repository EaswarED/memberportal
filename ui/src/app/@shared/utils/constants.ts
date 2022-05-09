export class Constants {
	public static readonly ADMIN_GROUP_NAME: string = 'Admin';

	public static readonly RECORD_STATUS_ACTIVE: string = 'Y';
	public static readonly RECORD_STATUS_INACTIVE: string = 'N';

	public static readonly API_STATUS_OK: number = 1;
	public static readonly API_STATUS_ERROR: number = 2;
	public static readonly API_STATUS_WARN: number = 3;

	public static readonly LANDING_GRID_PAGE_SIZE: number = 5;
	public static readonly DEFAULT_GRID_PAGE_SIZE: number = 10;

	public static readonly COUNTDOWN_MILLI_SECONDS: number = 1000;
	// Only for Testing
	public static readonly COUNTDOWN_JOIN_MS: number = 86400000; // 24 Hours
	public static readonly COUNTDOWN_CHECKIN_MS: number = 172800000; // 48 Hours
	// Replace after Testing
	public static readonly COUNTDOWN_JOIN_MS_ORIG: number = 900000; // 15 Minutes
	public static readonly COUNTDOWN_CHECKIN_MS_ORIG: number = 86400000; // 24 Hours
	public static readonly COUNTDOWN_TRIGGER_PATTERNS: string[] = [
		'00:14:59',
		'23:59:59',
		'47:59:59'
	];

	public static readonly CLASS_TYPE_APPOINTMENT: string = 'A'; // Appointment
	public static readonly CLASS_TYPE_CLASS: string = 'C'; // Class
	public static readonly CLASS_TYPE_GROUP: string = 'G'; // Group
	public static readonly CLASS_TYPE_CONTENT: string = 'S'; // Self-Care
	public static readonly CLASS_TYPE_DASHBOARD: string = 'D'; // Dashboard

	public static readonly CLASS_LABEL_APPOINTMENT: string = 'Appointment'; // Appointment
	public static readonly CLASS_LABEL_CLASS: string = 'Class'; // Class
	public static readonly CLASS_LABEL_GROUP: string = 'Group'; // Group

	public static readonly DIALOG_ACTION_CANCEL: string = 'C';
	public static readonly DIALOG_ACTION_RESCHEDULE: string = 'R';

	public static readonly ACCESS_PROMOTION_TYPE_GLOBAL: string = 'G';
	public static readonly ACCESS_PROMOTION_TYPE_COMPANY: string = 'C';
	public static readonly ACCESS_PROMOTION_TYPE_USER: string = 'U';
	public static readonly PROMOTION_TYPE_PROMOTION: string = 'P';
	public static readonly PROMOTION_TYPE_ACCESS: string = 'A';

	public static readonly LABEL_BUTTON_PAST: string = 'Complete';
	public static readonly LABEL_BUTTON_BOOK_NOW: string = 'Book Now';
	public static readonly LABEL_BUTTON_BOOKED: string = 'Booked';
	public static readonly LABEL_BUTTON_JOIN: string = 'Join Now';
	public static readonly LABEL_BUTTON_CHECKIN: string = 'Check In';
	public static readonly LABEL_BUTTON_JOIN_REQUEST: string = 'Request';
	public static readonly LABEL_BUTTON_JOIN_PENDING: string = 'Pending';
	public static readonly LABEL_BUTTON_CANCELLED: string = 'Cancelled';
	public static readonly LABEL_BUTTON_CHECKEDIN: string = 'Checked In';
	public static readonly LABEL_BUTTON_CONFIRMED: string = 'Confirmed';
	public static readonly LABEL_BUTTON_ARRIVED: string = 'Arrived';

	public static readonly FILTER_NEXT_7: number = 7;
	public static readonly FILTER_NEXT_30: number = 30;
	public static readonly FILTER_NEXT_60: number = 60;

	public static readonly CONTENT_TYPE_VIDEO: string = 'V'; // Video
	public static readonly CONTENT_TYPE_PDF: string = 'P'; // PDF

	public static readonly FORM_TYPE_CLINICAL: string = 'c'; // Video
	public static readonly FORM_TYPE_NON_CLINICAL: string = 'n'; // PDF

	public static readonly FORM_PHQ9_ID: string = '3825834'; // onpatientAdditionalInfo
	public static readonly FORM_GAD7_ID: string = '3825831'; // GAD 7
	public static readonly FORM_FAN8_ID: string = '4558052'; // FAN 8
	public static readonly FORM_MEDICAL_INFO_ID: string = '4256776'; // medicalInfo
	public static readonly FORM_NEW_PATIENT_ID: string = '4244888'; // newPatient

	public static readonly DOCTOR_ID: number = 263299; // onpatientAdditionalInfo
	public static readonly PATIENT_ID: number = 101523915; //

	public static readonly FORM_TYPE_APPOINTMENT: string = 'appt'; // Appointment
	public static readonly FORM_TYPE_CLASS: string = 'class'; // Class

	public static readonly FORM_JOT_URL: string = 'https://form.jotform.com/';
	public static readonly FORM_CHUNK_Size: number = 30;
}
