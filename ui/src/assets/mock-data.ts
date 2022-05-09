export const REC_APPOINTMENTS = {
	title: 'Recommended Appointments',
	items: [
		{
			id: '1000',
			name: 'Weekly Therapy',
			description: 'Weekly Therapy',
			state: 'Booked'
		},
		{
			id: '1001',
			name: 'Monthly Nutrition',
			description: 'Monthly Nutrition',
			state: 'Book Now'
		},
		{
			id: '1002',
			name: 'Meditation',
			description: 'Meditation',
			state: 'Book Now'
		},
		{
			id: '1000',
			name: 'Weekly Therapy',
			description: 'Weekly Therapy',
			state: 'Booked'
		},
		{
			id: '1001',
			name: 'Monthly Nutrition',
			description: 'Monthly Nutrition',
			state: 'Book Now'
		},
		{
			id: '1002',
			name: 'Meditation',
			description: 'Meditation',
			state: 'Book Now'
		}
	]
};

export const REC_GROUPS = {
	title: 'Recommended Groups',
	items: [
		{
			id: '1000',
			name: 'Weekly Therapy',
			description: 'Weekly Therapy',
			state: 'Booked'
		}
		// {
		// 	id: "1001",
		// 	name: "Monthly Nutrition",
		// 	description: "Monthly Nutrition",
		// 	state: "Book Now"
		// },
		// {
		// 	id: "1002",
		// 	name: "Meditation",
		// 	description: "Meditation",
		// 	state: "Book Now"
		// }
	]
};

export const REC_CLASSES = {
	title: 'Recommended Classes',
	items: [
		{
			id: '1000',
			name: 'Weekly Therapy',
			description: 'Weekly Therapy',
			state: 'Booked'
		},
		{
			id: '1001',
			name: 'Monthly Nutrition',
			description: 'Monthly Nutrition',
			state: 'Book Now'
		},
		{
			id: '1002',
			name: 'Meditation',
			description: 'Meditation',
			state: 'Book Now'
		}
	]
};

export const RECOMMENDED_CONTENT = [
	{
		id: '1004',
		name: 'This weeks guided Meditation',
		description: 'Classes & Workshops',
		image: 'classes.jpg'
	},

	{
		id: '1000',
		name: 'Tips for parents',
		description: 'Individual Therapy',
		image: 'therapy.png'
	},
	{
		id: '1001',
		name: 'Group Therapy Sessions',
		description: 'Group Therapy Sessions',
		image: 'group-therapy.jpeg'
	},
	{
		id: '1005',
		name: 'Tips to dealing with stress in workplace',
		description: 'Corporate Mental Wellness Program',
		image: 'corporate-solutions.jpg'
	},
	{
		id: '1003',
		name: 'Nutrition Tips by Lisa Berman',
		description: 'Nutrition For Mental Wellness',
		image: 'nutrition.jpg'
	},

	{
		id: '1002',
		name: 'Life & Business Coaching guide',
		description: 'Life & Business Coaching',
		image: 'coaching.jpg'
	}
];

export const UPCOMING_ACTIVITIES = [
	{
		id: '1000',
		name: 'Meditation',
		date: '09/03/2021',
		time: '9:00 am',
		provider: 'Dr.Jacob Jones',
		actions: 'Join Now'
	},
	{
		id: '1001',
		name: 'Anxiety',
		date: '09/03/2021',
		time: '9:30 am',
		provider: 'Dr.Theresa Webb',
		actions: 'Check-in'
	},
	{
		id: '1002',
		name: 'Yoga',
		date: '09/03/2021',
		time: '11:00 am',
		provider: 'Cyntia Gongalez',
		actions: 'Check-in'
	},
	{
		id: '1003',
		name: 'Meditation',
		date: '09/04/2021',
		time: '9:00 am',
		provider: 'Dr.Jacob Jones',
		actions: 'Join Now'
	},
	{
		id: '1003',
		name: 'Anxiety',
		date: '09/04/2021',
		time: '9:30 am',
		provider: 'Dr.Theresa Webb',
		actions: 'Check-in'
	},
	{
		id: '1005',
		name: 'Yoga',
		date: '09/04/2021',
		time: '11:00 am',
		provider: 'Cyntia Gongalez',
		actions: 'Check-in'
	}
];

export const ACTIVITIES_HEADER = [
	{ field: 'name', header: 'Activity' },
	{ field: 'date', header: 'Date' },
	{ field: 'time', header: 'Time' },
	{ field: 'provider', header: 'Provider Name' },
	{ field: 'actions', header: 'Action' }
];

export const ACTIVITIES_GRID_HEADER = [
	'activity',
	'date',
	'time',
	'providerName',
	'action'
];

// company
export const COMPANY_CONTENT = [
	{
		id: '1000',
		content: 'Are you burnt out',
		category: 'Mental Health',
		startdate: '2/10/2022',
		enddate: '4/10/2022',
		type: 'video'
	},
	{
		id: '1001',
		content: 'Separate work and home life',
		category: 'Mental Health',
		startdate: '2/10/2022',
		enddate: '4/10/2022',
		type: 'video'
	}
];

export const ACTIVITIES_GRID_DATA = [
	{
		id: '1000',
		activity: 'Meditation',
		icon: 'self_improvement',
		date: '09/03/2021',
		time: '9:00 am',
		providerName: 'Dr.Jacob Jones',
		action: 'Join Now'
	},
	{
		id: '1000',
		activity: 'Meditation',
		icon: 'self_improvement',
		date: '09/03/2021',
		time: '9:00 am',
		providerName: 'Dr.Jacob Jones',
		action: 'Join Now'
	},
	{
		id: '1003',
		activity: 'Anxiety',
		icon: 'groups',
		date: '09/04/2021',
		time: '9:30 am',
		providerName: 'Dr.Theresa Webb',
		action: 'Check-in'
	},
	{
		id: '1005',
		activity: 'Yoga',
		icon: 'self_improvement',
		date: '09/04/2021',
		time: '11:00 am',
		providerName: 'Cyntia Gongalez',
		action: 'Check-in'
	}
];

export const APPOINTMENTS_HEADER = [
	{ field: 'name', header: 'Appointment Name' },
	{ field: 'provider', header: 'Provider Name' },
	{ field: 'date', header: 'Date' },
	{ field: 'actions', header: 'Action' }
];

export const ALL_APPOINTMENTS = [
	{
		id: '1000',
		name: 'Meditation',
		date: '09/03/2021',
		time: '9:00 am',
		provider: 'Dr.Jacob Jones',
		actions: 'Join Now'
	},
	{
		id: '1001',
		name: 'Anxiety',
		date: '09/03/2021',
		time: '9:30 am',
		provider: 'Dr.Theresa Webb',
		actions: 'Check-in'
	},
	{
		id: '1002',
		name: 'Yoga',
		date: '09/03/2021',
		time: '11:00 am',
		provider: 'Cyntia Gongalez',
		actions: 'Check-in'
	},
	{
		id: '1003',
		name: 'Meditation',
		date: '09/04/2021',
		time: '9:00 am',
		provider: 'Dr.Jacob Jones',
		actions: 'Join Now'
	},
	{
		id: '1003',
		name: 'Anxiety',
		date: '09/04/2021',
		time: '9:30 am',
		provider: 'Dr.Theresa Webb',
		actions: 'Check-in'
	},
	{
		id: '1005',
		name: 'Yoga',
		date: '09/04/2021',
		time: '11:00 am',
		provider: 'Cyntia Gongalez',
		actions: 'Check-in'
	}
];

export const OTHER_SERVICES = [
	{
		id: '1004',
		name: 'Mindworx Morning Meditation',
		description:
			'Our 15-Minute Morning Meditation is a quick and simple way to help clear your mind for a happy perspective to start your day.',
		image: 'classes.jpg'
	}
];

export const countries: Array<any> = [
	{
		code: 'US',
		name: 'UNITED STATES'
	},
	{
		code: 'AF',
		name: 'AFGHANISTAN'
	},
	{
		code: 'AX',
		name: 'ÅLAND ISLANDS'
	},
	{
		code: 'AL',
		name: 'ALBANIA'
	},
	{
		code: 'DZ',
		name: 'ALGERIA'
	},
	{
		code: 'AS',
		name: 'AMERICAN SAMOA'
	},
	{
		code: 'AD',
		name: 'ANDORRA'
	},
	{
		code: 'AO',
		name: 'ANGOLA'
	},
	{
		code: 'AI',
		name: 'ANGUILLA'
	},
	{
		code: 'AQ',
		name: 'ANTARCTICA'
	},
	{
		code: 'AG',
		name: 'ANTIGUA AND BARBUDA'
	},
	{
		code: 'AR',
		name: 'ARGENTINA'
	},
	{
		code: 'AM',
		name: 'ARMENIA'
	},
	{
		code: 'AW',
		name: 'ARUBA'
	},
	{
		code: 'AU',
		name: 'AUSTRALIA'
	},
	{
		code: 'AT',
		name: 'AUSTRIA'
	},
	{
		code: 'AZ',
		name: 'AZERBAIJAN'
	},
	{
		code: 'BS',
		name: 'BAHAMAS'
	},
	{
		code: 'BH',
		name: 'BAHRAIN'
	},
	{
		code: 'BD',
		name: 'BANGLADESH'
	},
	{
		code: 'BB',
		name: 'BARBADOS'
	},
	{
		code: 'BY',
		name: 'BELARUS'
	},
	{
		code: 'BE',
		name: 'BELGIUM'
	},
	{
		code: 'BZ',
		name: 'BELIZE'
	},
	{
		code: 'BJ',
		name: 'BENIN'
	},
	{
		code: 'BM',
		name: 'BERMUDA'
	},
	{
		code: 'BT',
		name: 'BHUTAN'
	},
	{
		code: 'BO',
		name: 'BOLIVIA'
	},
	{
		code: 'BA',
		name: 'BOSNIA AND HERZEGOVINA'
	},
	{
		code: 'BW',
		name: 'BOTSWANA'
	},
	{
		code: 'BV',
		name: 'BOUVET ISLAND'
	},
	{
		code: 'BR',
		name: 'BRAZIL'
	},
	{
		code: 'IO',
		name: 'BRITISH INDIAN OCEAN TERRITORY'
	},
	{
		code: 'BN',
		name: 'BRUNEI DARUSSALAM'
	},
	{
		code: 'BG',
		name: 'BULGARIA'
	},
	{
		code: 'BF',
		name: 'BURKINA FASO'
	},
	{
		code: 'BI',
		name: 'BURUNDI'
	},
	{
		code: 'KH',
		name: 'CAMBODIA'
	},
	{
		code: 'CM',
		name: 'CAMEROON'
	},
	{
		code: 'CA',
		name: 'CANADA'
	},
	{
		code: 'CV',
		name: 'CAPE VERDE'
	},
	{
		code: 'KY',
		name: 'CAYMAN ISLANDS'
	},
	{
		code: 'CF',
		name: 'CENTRAL AFRICAN REPUBLIC'
	},
	{
		code: 'TD',
		name: 'CHAD'
	},
	{
		code: 'CL',
		name: 'CHILE'
	},
	{
		code: 'CN',
		name: 'CHINA'
	},
	{
		code: 'CX',
		name: 'CHRISTMAS ISLAND'
	},
	{
		code: 'CC',
		name: 'COCOS (KEELING) ISLANDS'
	},
	{
		code: 'CO',
		name: 'COLOMBIA'
	},
	{
		code: 'KM',
		name: 'COMOROS'
	},
	{
		code: 'CG',
		name: 'CONGO'
	},
	{
		code: 'CD',
		name: 'CONGO, THE DEMOCRATIC REPUBLIC OF THE'
	},
	{
		code: 'CK',
		name: 'COOK ISLANDS'
	},
	{
		code: 'CR',
		name: 'COSTA RICA'
	},
	{
		code: 'CI',
		name: "COTE D''IVOIRE"
	},
	{
		code: 'HR',
		name: 'CROATIA'
	},
	{
		code: 'CU',
		name: 'CUBA'
	},
	{
		code: 'UC',
		name: 'CURAÇAO'
	},
	{
		code: 'CY',
		name: 'CYPRUS'
	},
	{
		code: 'CZ',
		name: 'CZECH REPUBLIC'
	},
	{
		code: 'DK',
		name: 'DENMARK'
	},
	{
		code: 'DJ',
		name: 'DJIBOUTI'
	},
	{
		code: 'DM',
		name: 'DOMINICA'
	},
	{
		code: 'DO',
		name: 'DOMINICAN REPUBLIC'
	},
	{
		code: 'EC',
		name: 'ECUADOR'
	},
	{
		code: 'EG',
		name: 'EGYPT'
	},
	{
		code: 'SV',
		name: 'EL SALVADOR'
	},
	{
		code: 'GQ',
		name: 'EQUATORIAL GUINEA'
	},
	{
		code: 'ER',
		name: 'ERITREA'
	},
	{
		code: 'EE',
		name: 'ESTONIA'
	},
	{
		code: 'ET',
		name: 'ETHIOPIA'
	},
	{
		code: 'FK',
		name: 'FALKLAND ISLANDS (MALVINAS)'
	},
	{
		code: 'FO',
		name: 'FAROE ISLANDS'
	},
	{
		code: 'FJ',
		name: 'FIJI'
	},
	{
		code: 'FI',
		name: 'FINLAND'
	},
	{
		code: 'FR',
		name: 'FRANCE'
	},
	{
		code: 'GF',
		name: 'FRENCH GUIANA'
	},
	{
		code: 'PF',
		name: 'FRENCH POLYNESIA'
	},
	{
		code: 'TF',
		name: 'FRENCH SOUTHERN TERRITORIES'
	},
	{
		code: 'GA',
		name: 'GABON'
	},
	{
		code: 'GM',
		name: 'GAMBIA'
	},
	{
		code: 'GE',
		name: 'GEORGIA'
	},
	{
		code: 'DE',
		name: 'GERMANY'
	},
	{
		code: 'GH',
		name: 'GHANA'
	},
	{
		code: 'GI',
		name: 'GIBRALTAR'
	},
	{
		code: 'GR',
		name: 'GREECE'
	},
	{
		code: 'GL',
		name: 'GREENLAND'
	},
	{
		code: 'GD',
		name: 'GRENADA'
	},
	{
		code: 'GP',
		name: 'GUADELOUPE'
	},
	{
		code: 'GU',
		name: 'GUAM'
	},
	{
		code: 'GT',
		name: 'GUATEMALA'
	},
	{
		code: 'G',
		name: 'GUERNSEY'
	},
	{
		code: 'GN',
		name: 'GUINEA'
	},
	{
		code: 'GW',
		name: 'GUINEA-BISSAU'
	},
	{
		code: 'GY',
		name: 'GUYANA'
	},
	{
		code: 'HT',
		name: 'HAITI'
	},
	{
		code: 'HM',
		name: 'HEARD ISLAND AND MCDONALD ISLANDS'
	},
	{
		code: 'VA',
		name: 'HOLY SEE (VATICAN CITY STATE)'
	},
	{
		code: 'HN',
		name: 'HONDURAS'
	},
	{
		code: 'HK',
		name: 'HONG KONG'
	},
	{
		code: 'HU',
		name: 'HUNGARY'
	},
	{
		code: 'IS',
		name: 'ICELAND'
	},
	{
		code: 'IN',
		name: 'INDIA'
	},
	{
		code: 'ID',
		name: 'INDONESIA'
	},
	{
		code: 'IR',
		name: 'IRAN, ISLAMIC REPUBLIC OF'
	},
	{
		code: 'IQ',
		name: 'IRAQ'
	},
	{
		code: 'IE',
		name: 'IRELAND'
	},
	{
		code: 'IM',
		name: 'ISLE OF MAN'
	},
	{
		code: 'IL',
		name: 'ISRAEL'
	},
	{
		code: 'IT',
		name: 'ITALY'
	},
	{
		code: 'JM',
		name: 'JAMAICA'
	},
	{
		code: 'JP',
		name: 'JAPAN'
	},
	{
		code: 'JE',
		name: 'JERSEY'
	},
	{
		code: 'JO',
		name: 'JORDAN'
	},
	{
		code: 'KZ',
		name: 'KAZAKHSTAN'
	},
	{
		code: 'KE',
		name: 'KENYA'
	},
	{
		code: 'KI',
		name: 'KIRIBATI'
	},
	{
		code: 'KP',
		name: "KOREA, DEMOCRATIC PEOPLE''S REPUBLIC OF"
	},
	{
		code: 'KR',
		name: 'KOREA, REPUBLIC OF'
	},
	{
		code: 'KW',
		name: 'KUWAIT'
	},
	{
		code: 'KG',
		name: 'KYRGYZSTAN'
	},
	{
		code: 'LA',
		name: "LAO PEOPLE''S DEMOCRATIC REPUBLIC"
	},
	{
		code: 'LV',
		name: 'LATVIA'
	},
	{
		code: 'LB',
		name: 'LEBANON'
	},
	{
		code: 'LS',
		name: 'LESOTHO'
	},
	{
		code: 'LR',
		name: 'LIBERIA'
	},
	{
		code: 'LY',
		name: 'LIBYAN ARAB JAMAHIRIYA'
	},
	{
		code: 'LI',
		name: 'LIECHTENSTEIN'
	},
	{
		code: 'LT',
		name: 'LITHUANIA'
	},
	{
		code: 'LU',
		name: 'LUXEMBOURG'
	},
	{
		code: 'MO',
		name: 'MACAO'
	},
	{
		code: 'MK',
		name: 'MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF'
	},
	{
		code: 'MG',
		name: 'MADAGASCAR'
	},
	{
		code: 'MW',
		name: 'MALAWI'
	},
	{
		code: 'MY',
		name: 'MALAYSIA'
	},
	{
		code: 'MV',
		name: 'MALDIVES'
	},
	{
		code: 'ML',
		name: 'MALI'
	},
	{
		code: 'MT',
		name: 'MALTA'
	},
	{
		code: 'MH',
		name: 'MARSHALL ISLANDS'
	},
	{
		code: 'MQ',
		name: 'MARTINIQUE'
	},
	{
		code: 'MR',
		name: 'MAURITANIA'
	},
	{
		code: 'MU',
		name: 'MAURITIUS'
	},
	{
		code: 'YT',
		name: 'MAYOTTE'
	},
	{
		code: 'MX',
		name: 'MEXICO'
	},
	{
		code: 'FM',
		name: 'MICRONESIA, FEDERATED STATES OF'
	},
	{
		code: 'MD',
		name: 'MOLDOVA, REPUBLIC OF'
	},
	{
		code: 'MC',
		name: 'MONACO'
	},
	{
		code: 'MN',
		name: 'MONGOLIA'
	},
	{
		code: 'MS',
		name: 'MONTSERRAT'
	},
	{
		code: 'MA',
		name: 'MOROCCO'
	},
	{
		code: 'MZ',
		name: 'MOZAMBIQUE'
	},
	{
		code: 'MM',
		name: 'MYANMAR'
	},
	{
		code: 'NA',
		name: 'NAMIBIA'
	},
	{
		code: 'NR',
		name: 'NAURU'
	},
	{
		code: 'NP',
		name: 'NEPAL'
	},
	{
		code: 'NL',
		name: 'NETHERLANDS'
	},
	{
		code: 'AN',
		name: 'NETHERLANDS ANTILLES'
	},
	{
		code: 'NC',
		name: 'NEW CALEDONIA'
	},
	{
		code: 'NZ',
		name: 'NEW ZEALAND'
	},
	{
		code: 'NI',
		name: 'NICARAGUA'
	},
	{
		code: 'NE',
		name: 'NIGER'
	},
	{
		code: 'NG',
		name: 'NIGERIA'
	},
	{
		code: 'NU',
		name: 'NIUE'
	},
	{
		code: 'NF',
		name: 'NORFOLK ISLAND'
	},
	{
		code: 'MP',
		name: 'NORTHERN MARIANA ISLANDS'
	},
	{
		code: 'NO',
		name: 'NORWAY'
	},
	{
		code: 'OM',
		name: 'OMAN'
	},
	{
		code: 'PK',
		name: 'PAKISTAN'
	},
	{
		code: 'PW',
		name: 'PALAU'
	},
	{
		code: 'PS',
		name: 'PALESTINIAN TERRITORY, OCCUPIED'
	},
	{
		code: 'PA',
		name: 'PANAMA'
	},
	{
		code: 'PG',
		name: 'PAPUA NEW GUINEA'
	},
	{
		code: 'PY',
		name: 'PARAGUAY'
	},
	{
		code: 'PE',
		name: 'PERU'
	},
	{
		code: 'PH',
		name: 'PHILIPPINES'
	},
	{
		code: 'PN',
		name: 'PITCAIRN'
	},
	{
		code: 'PL',
		name: 'POLAND'
	},
	{
		code: 'PT',
		name: 'PORTUGAL'
	},
	{
		code: 'PR',
		name: 'PUERTO RICO'
	},
	{
		code: 'QA',
		name: 'QATAR'
	},
	{
		code: 'TW',
		name: 'REPUBLIC OF CHINA'
	},
	{
		code: 'RE',
		name: 'REUNION'
	},
	{
		code: 'RO',
		name: 'ROMANIA'
	},
	{
		code: 'RU',
		name: 'RUSSIAN FEDERATION'
	},
	{
		code: 'RW',
		name: 'RWANDA'
	},
	{
		code: 'SH',
		name: 'SAINT HELENA'
	},
	{
		code: 'KN',
		name: 'SAINT KITTS AND NEVIS'
	},
	{
		code: 'LC',
		name: 'SAINT LUCIA'
	},
	{
		code: 'PM',
		name: 'SAINT PIERRE AND MIQUELON'
	},
	{
		code: 'VC',
		name: 'SAINT VINCENT AND THE GRENADINES'
	},
	{
		code: 'WS',
		name: 'SAMOA'
	},
	{
		code: 'SM',
		name: 'SAN MARINO'
	},
	{
		code: 'ST',
		name: 'SAO TOME AND PRINCIPE'
	},
	{
		code: 'SA',
		name: 'SAUDI ARABIA'
	},
	{
		code: 'SN',
		name: 'SENEGAL'
	},
	{
		code: 'CS',
		name: 'SERBIA AND MONTENEGRO'
	},
	{
		code: 'SC',
		name: 'SEYCHELLES'
	},
	{
		code: 'SL',
		name: 'SIERRA LEONE'
	},
	{
		code: 'SG',
		name: 'SINGAPORE'
	},
	{
		code: 'SK',
		name: 'SLOVAKIA'
	},
	{
		code: 'SI',
		name: 'SLOVENIA'
	},
	{
		code: 'SB',
		name: 'SOLOMON ISLANDS'
	},
	{
		code: 'SO',
		name: 'SOMALIA'
	},
	{
		code: 'ZA',
		name: 'SOUTH AFRICA'
	},
	{
		code: 'GS',
		name: 'SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS'
	},
	{
		code: 'ES',
		name: 'SPAIN'
	},
	{
		code: 'LK',
		name: 'SRI LANKA'
	},
	{
		code: 'SD',
		name: 'SUDAN'
	},
	{
		code: 'SR',
		name: 'SURINAME'
	},
	{
		code: 'SJ',
		name: 'SVALBARD AND JAN MAYEN'
	},
	{
		code: 'SZ',
		name: 'SWAZILAND'
	},
	{
		code: 'SE',
		name: 'SWEDEN'
	},
	{
		code: 'CH',
		name: 'SWITZERLAND'
	},
	{
		code: 'SY',
		name: 'SYRIAN ARAB REPUBLIC'
	},
	{
		code: 'TJ',
		name: 'TAJIKISTAN'
	},
	{
		code: 'TZ',
		name: 'TANZANIA, UNITED REPUBLIC OF'
	},
	{
		code: 'TH',
		name: 'THAILAND'
	},
	{
		code: 'TL',
		name: 'TIMOR-LESTE'
	},
	{
		code: 'TG',
		name: 'TOGO'
	},
	{
		code: 'TK',
		name: 'TOKELAU'
	},
	{
		code: 'TO',
		name: 'TONGA'
	},
	{
		code: 'TT',
		name: 'TRINIDAD AND TOBAGO'
	},
	{
		code: 'TN',
		name: 'TUNISIA'
	},
	{
		code: 'TR',
		name: 'TURKEY'
	},
	{
		code: 'TM',
		name: 'TURKMENISTAN'
	},
	{
		code: 'TC',
		name: 'TURKS AND CAICOS ISLANDS'
	},
	{
		code: 'TV',
		name: 'TUVALU'
	},
	{
		code: 'UG',
		name: 'UGANDA'
	},
	{
		code: 'UA',
		name: 'UKRAINE'
	},
	{
		code: 'AE',
		name: 'UNITED ARAB EMIRATES'
	},
	{
		code: 'GB',
		name: 'UNITED KINGDOM'
	},
	{
		code: 'UM',
		name: 'UNITED STATES MINOR OUTLYING ISLANDS'
	},
	{
		code: 'UY',
		name: 'URUGUAY'
	},
	{
		code: 'UZ',
		name: 'UZBEKISTAN'
	},
	{
		code: 'VU',
		name: 'VANUATU'
	},
	{
		code: 'VE',
		name: 'VENEZUELA'
	},
	{
		code: 'VN',
		name: 'VIET NAM'
	},
	{
		code: 'VG',
		name: 'VIRGIN ISLANDS, BRITISH'
	},
	{
		code: 'VI',
		name: 'VIRGIN ISLANDS, U.S.'
	},
	{
		code: 'WF',
		name: 'WALLIS AND FUTUNA'
	},
	{
		code: 'EH',
		name: 'WESTERN SAHARA'
	},
	{
		code: 'YE',
		name: 'YEMEN'
	},
	{
		code: 'ZM',
		name: 'ZAMBIA'
	},
	{
		code: 'ZW',
		name: 'ZIMBABWE'
	}
];
export const cities: Array<any> = [
	{
		code: 'AL',
		name: 'Alabama'
	},
	{
		code: 'AK',
		name: 'Alaska'
	},
	{
		code: 'AS',
		name: 'American Samoa'
	},
	{
		code: 'AZ',
		name: 'Arizona'
	},
	{
		code: 'AR',
		name: 'Arkansas'
	},
	{
		code: 'CA',
		name: 'California'
	},
	{
		code: 'CO',
		name: 'Colorado'
	},
	{
		code: 'CT',
		name: 'Connecticut'
	},
	{
		code: 'DE',
		name: 'Delaware'
	},
	{
		code: 'DC',
		name: 'District of Columbia'
	},
	{
		code: 'FL',
		name: 'Florida'
	},
	{
		code: 'GA',
		name: 'Georgia'
	},
	{
		code: 'HI',
		name: 'Hawaii'
	},
	{
		code: 'ID',
		name: 'Idaho'
	},
	{
		code: 'IL',
		name: 'Illinois'
	},
	{
		code: 'IN',
		name: 'Indiana'
	},
	{
		code: 'IA',
		name: 'Iowa'
	},
	{
		code: 'KS',
		name: 'Kansas'
	},
	{
		code: 'KY',
		name: 'Kentucky'
	},
	{
		code: 'LA',
		name: 'Louisiana'
	},
	{
		code: 'ME',
		name: 'Maine'
	},
	{
		code: 'MD',
		name: 'Maryland'
	},
	{
		code: 'MA',
		name: 'Massachusetts'
	},
	{
		code: 'MI',
		name: 'Michigan'
	},
	{
		code: 'MN',
		name: 'Minnesota'
	},
	{
		code: 'MS',
		name: 'Mississippi'
	},
	{
		code: 'MO',
		name: 'Missouri'
	},
	{
		code: 'MT',
		name: 'Montana'
	},
	{
		code: 'NE',
		name: 'Nebraska'
	},
	{
		code: 'NV',
		name: 'Nevada'
	},
	{
		code: 'NH',
		name: 'New Hampshire'
	},
	{
		code: 'NJ',
		name: 'New Jersey'
	},
	{
		code: 'NM',
		name: 'New Mexico'
	},
	{
		code: 'NY',
		name: 'New York'
	},
	{
		code: 'NC',
		name: 'North Carolina'
	},
	{
		code: 'ND',
		name: 'North Dakota'
	},
	{
		code: 'MP',
		name: 'Northern Mariana Islands'
	},
	{
		code: 'OH',
		name: 'Ohio'
	},
	{
		code: 'OK',
		name: 'Oklahoma'
	},
	{
		code: 'OR',
		name: 'Oregon'
	},
	{
		code: 'PA',
		name: 'Pennsylvania'
	},
	{
		code: 'RI',
		name: 'Rhode Island'
	},
	{
		code: 'SC',
		name: 'South Carolina'
	},
	{
		code: 'SD',
		name: 'South Dakota'
	},
	{
		code: 'TN',
		name: 'Tennessee'
	},
	{
		code: 'TX',
		name: 'Texas'
	},
	{
		code: 'UT',
		name: 'Utah'
	},
	{
		code: 'VT',
		name: 'Vermont'
	},
	{
		code: 'VA',
		name: 'Virginia'
	},
	{
		code: 'WA',
		name: 'Washington'
	},
	{
		code: 'WV',
		name: 'West Virginia'
	},
	{
		code: 'WI',
		name: 'Wisconsin'
	},
	{
		code: 'WY',
		name: 'Wyoming'
	}
];

export const races: Array<any> = [
	{
		code: 'indian',
		name: 'American Indian or Alaska Native'
	},
	{
		code: 'asian',
		name: 'Asian'
	},
	{
		code: 'black or african american',
		name: 'Black or African American'
	},
	{
		code: 'native hawaiian or other pacific islander',
		name: 'Native Hawaiian or Other Pacific Islander'
	},
	{
		code: 'white',
		name: 'White'
	},
	{
		code: 'other race',
		name: 'Other Race'
	},
	{
		code: 'declined',
		name: 'Declined to specify'
	}
];

export const ethinicities: Array<any> = [
	{
		code: 'hispanic',
		name: 'Hispanic or Lationo'
	},
	{
		code: 'not hispanic or lationo',
		name: 'Not Hispanic or Lationo'
	},
	{
		code: 'declined',
		name: 'Declined to specify'
	}
];

export const languages: Array<any> = [
	{
		code: 'eng',
		name: 'English'
	},
	{
		code: 'fra',
		name: 'French'
	},
	{
		code: 'spa',
		name: 'Spain'
	},
	{
		code: 'declined',
		name: 'Declined to specify'
	}
];

export const NotificationList = [
	{
		from: 'Dr. Jacob Jone',
		message: 'Please send me please your contact information',
		date: '3/22/2021 14:23',
		action: ''
	},
	{
		from: 'Dr. Jacob Jone',
		message: 'Please send me please your contact information',
		date: '3/22/2021 14:23',
		action: ''
	},
	{
		from: 'Dr. Jacob Jone',
		message: 'Please send me please your contact information',
		date: '3/22/2021 14:23',
		action: ''
	},
	{
		from: 'Dr. Jacob Jone',
		message: 'Please send me please your contact information',
		date: '3/22/2021 14:23',
		action: ''
	}
];

export const AccountList = [
	{
		accountName: 'Mayan',
		billingSchedule: 'Monthly 1st',
		accountBal: 0.0,
		default: 'Yes',
		actions: ''
	}
];

export const HEADER_BILLING = [
	{
		invoice: '234',
		purchasedate: '03-28-2021',
		servicetype: '1 theraphy session',
		quantity: '1 Pack',
		fundingsource: 'mc***4390',
		total: '$20',
		action: 'billing'
	},
	{
		invoice: '334',
		purchasedate: '03-25-2021',
		servicetype: '12 Therapy session',
		quantity: '12 Pack',
		fundingsource: 'mc***4390',
		total: '$20',
		action: 'billing'
	},
	{
		invoice: '567',
		purchasedate: '02-22-2021',
		servicetype: 'Mindworx Meditation',
		quantity: '6 Pack',
		fundingsource: 'mc***4390',
		total: '$20',
		action: 'billing'
	},
	{
		invoice: '578',
		purchasedate: '02-15-2021',
		servicetype: 'Weekly Therapy',
		quantity: '4 Pack',
		fundingsource: 'mc***4390',
		total: '$20',
		action: 'billing'
	}
];
export const HEADER_BILLING_UNUSED = {
	title: 'Unused Activities',
	item: [
		{
			purchasedate: '04-28-2021',
			servicetype: 'Weekly Therapy',
			quantitypurchased: '1 Pack',
			quantityscheduled: '1 Pack',
			quantityunscheduled: '0 Pack',
			expirydate: '04-28-2021'
		},
		{
			purchasedate: '03-25-2022',
			servicetype: 'Weekly Therapy',
			quantitypurchased: '12 Pack',
			quantityscheduled: '10 Pack',
			quantityunscheduled: '2 Pack',
			expirydate: '03-25-2022'
		},
		{
			purchasedate: '07-22-2021',
			servicetype: 'Weekly Therapy',
			quantitypurchased: '1 Pack',
			quantityscheduled: '1 Pack',
			quantityunscheduled: '0 Pack',
			expirydate: '07-22-2021'
		},
		{
			purchasedate: '01-jan-2021',
			servicetype: 'Weekly Therapy',
			quantitypurchased: '6 Pack',
			quantityscheduled: '2 Pack',
			quantityunscheduled: '4 Pack',
			expirydate: '01-jan-2022'
		}
	]
};

export const APPT_CONFIG_DATA = [
	{
		id: '1004',
		name: 'Coaching',
		description: 'Coaching description',
		category_id: 1001,
		category_name: 'Appointments',
		publish: true,
		global: true,
		makeasappt: false,
		status: 'Active'
	},
	{
		id: '1005',
		name: 'Therapist',
		category_id: 1001,
		description: 'Coaching description',
		publish: true,
		global: true,
		makeasappt: false,
		status: 'Active'
	},
	{
		id: '1006',
		name: 'Psychiatrist',
		category_id: 1001,
		description: 'Coaching description',
		publish: true,
		global: true,
		makeasappt: false,
		status: 'Active'
	},
	{
		id: '1007',
		name: 'Nutrition',
		category_id: 1001,
		description: 'Coaching description',
		publish: true,
		global: true,
		makeasappt: true,
		status: 'Active'
	}
];

export const COMPANY_GRID_DATA = [
	{
		id: '1000',
		idno: 'MW12345',
		companyname: 'Sect Tech',
		location: 'LA',
		website: 'www.sptech.com'
	},
	{
		id: '1001',
		idno: 'MW12345',
		companyname: 'Sect Tech',
		location: 'LA',
		website: 'www.sptech.com'
	},

	{
		id: '1005',
		idno: 'MW12345',
		companyname: 'Times now',
		location: 'NY',
		website: 'www.sptech.com'
	},
	{
		id: '1006',
		idno: 'MW12345',
		companyname: 'Sq tech inc',
		location: 'LA',
		website: 'www.sptech.com'
	},
	{
		id: '1007',
		idno: 'MW12345',
		companyname: 'Circle Boss',
		location: 'LA',
		website: 'www.sptech.com'
	},
	{
		id: '1008',
		idno: 'MW12345',
		companyname: 'Sea view tech',
		location: 'VA',
		website: 'www.sptech.com'
	},
	{
		id: '1009',
		idno: 'MW12345',
		companyname: 'Tom Jerry inc',
		location: 'NY',
		website: 'www.sptech.com'
	}
];

export const SELF_CONFIG_DATA = [
	{
		id: 100,
		name: 'Daily SelfCare',
		program: 'Mental Health',
		date: 11 / 25 / 2021,
		enddate: '01/05/2022',
		type: 'Video',
		status: 'Active'
	},
	{
		id: 101,
		name: 'A Guide to Anxiety',
		program: 'Mental Health',
		date: 11 / 25 / 2021,
		enddate: '01/05/2022',
		type: 'Article',
		status: 'Active'
	},
	{
		id: 102,
		name: 'A Guide to Sleep',
		program: 'Mental Health',
		date: 11 / 25 / 2021,
		enddate: '01/05/2022',
		type: 'Article',
		status: 'Active'
	},
	{
		id: 103,
		name: 'Mind focussed Nutrition',
		program: 'Mental Health',
		date: 11 / 25 / 2021,
		enddate: '02/20/2022',
		type: 'Video',
		status: 'Active'
	}
];

export const CATEGORIES_DATA = [
	{
		id: 1000,
		name: 'Meditation',
		description: 'Meditation',
		type: 'A'
	},
	{
		id: 1001,
		name: 'Classes',
		description: 'Classes',
		type: 'A'
	},
	{
		id: 1002,
		name: 'Yoga',
		description: 'Yoga',
		type: 'C'
	}
];
