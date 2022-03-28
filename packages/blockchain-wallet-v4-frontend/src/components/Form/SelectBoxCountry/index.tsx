import React from 'react'
import { FormattedMessage } from 'react-intl'

import SelectBox from '../SelectBox'

export const whiteBlackListsConflictMessage =
  'Cannot use both blacklist and whitelist in SelectBoxCountry component'

type Country = {
  emoji: string
  text: string
  value: string
}

export const countries: Country[] = [
  {
    emoji: '🇦🇩',
    text: 'Andorra',
    value: 'AD'
  },
  {
    emoji: '🇦🇪',
    text: 'United Arab Emirates',
    value: 'AE'
  },
  {
    emoji: '🇦🇬',
    text: 'Antigua and Barbuda',
    value: 'AG'
  },
  {
    emoji: '🇦🇮',
    text: 'Anguilla',
    value: 'AI'
  },
  {
    emoji: '🇦🇱',
    text: 'Albania',
    value: 'AL'
  },
  {
    emoji: '🇦🇴',
    text: 'Armenia',
    value: 'AM'
  },
  {
    emoji: '🇦🇴',
    text: 'Angola',
    value: 'AO'
  },
  {
    emoji: '🇦🇷',
    text: 'Argentina',
    value: 'AR'
  },
  {
    emoji: '🇦🇸',
    text: 'American Samoa',
    value: 'AS'
  },
  {
    emoji: '🇦🇹',
    text: 'Austria',
    value: 'AT'
  },
  {
    emoji: '🇦🇺',
    text: 'Australia',
    value: 'AU'
  },
  {
    emoji: '🇦🇼',
    text: 'Aruba',
    value: 'AW'
  },
  {
    emoji: '🇦🇿',
    text: 'Azerbaijan',
    value: 'AZ'
  },
  {
    emoji: '🇧🇦',
    text: 'Bosnia and Herzegovina',
    value: 'BA'
  },
  {
    emoji: '🇧🇧',
    text: 'Barbados',
    value: 'BB'
  },
  {
    emoji: '🇧🇩',
    text: 'Bangladesh',
    value: 'BD'
  },
  {
    emoji: '🇧🇾',
    text: 'Belarus',
    value: 'BY'
  },
  {
    emoji: '🇧🇪',
    text: 'Belgium',
    value: 'BE'
  },
  {
    emoji: '🇧🇫',
    text: 'Burkina Faso',
    value: 'BF'
  },
  {
    emoji: '🇧🇬',
    text: 'Bulgaria',
    value: 'BG'
  },
  {
    emoji: '🇧🇭',
    text: 'Bahrain',
    value: 'BH'
  },
  {
    emoji: '🇧🇮',
    text: 'Burundi',
    value: 'BI'
  },
  {
    emoji: '🇧🇯',
    text: 'Benin',
    value: 'BJ'
  },
  {
    emoji: '🇧🇱',
    text: 'Saint Barthélemy',
    value: 'BL'
  },
  {
    emoji: '🇧🇲',
    text: 'Bermuda',
    value: 'BM'
  },
  {
    emoji: '🇧🇳',
    text: 'Brunei Darussalam',
    value: 'BN'
  },
  {
    emoji: '🇧🇴',
    text: 'Bolivia',
    value: 'BO'
  },
  {
    emoji: '🇧🇶',
    text: 'Bonaire, Sint Eustatius and Saba',
    value: 'BQ'
  },
  {
    emoji: '🇧🇷',
    text: 'Brazil',
    value: 'BR'
  },
  {
    emoji: '🇧🇸',
    text: 'Bahamas',
    value: 'BS'
  },
  {
    emoji: '🇧🇹',
    text: 'Bhutan',
    value: 'BT'
  },
  {
    emoji: '🇧🇻',
    text: 'Bouvet Island',
    value: 'BV'
  },
  {
    emoji: '🇧🇼',
    text: 'Botswana',
    value: 'BW'
  },
  {
    emoji: '🇧🇿',
    text: 'Belize',
    value: 'BZ'
  },
  {
    emoji: '🇨🇦',
    text: 'Canada',
    value: 'CA'
  },
  {
    emoji: '🇨🇨',
    text: 'Cocos (Keeling) Islands',
    value: 'CC'
  },
  {
    emoji: '🇨🇭',
    text: 'Switzerland',
    value: 'CH'
  },
  {
    emoji: '🇨🇰',
    text: 'Cook Islands',
    value: 'CK'
  },
  {
    emoji: '🇨🇱',
    text: 'Chile',
    value: 'CL'
  },
  {
    emoji: '🇨🇲',
    text: 'Cameroon',
    value: 'CM'
  },
  {
    emoji: '🇨🇳',
    text: 'China',
    value: 'CN'
  },
  {
    emoji: '🇨🇴',
    text: 'Colombia',
    value: 'CO'
  },
  {
    emoji: '🇨🇷',
    text: 'Costa Rica',
    value: 'CR'
  },
  {
    emoji: '🇨🇻',
    text: 'Cape Verde',
    value: 'CV'
  },
  {
    emoji: '🇨🇼',
    text: 'Curaçao',
    value: 'CW'
  },
  {
    emoji: '🇨🇽',
    text: 'Christmas Island',
    value: 'CX'
  },
  {
    emoji: '🇨🇾',
    text: 'Cyprus',
    value: 'CY'
  },
  {
    emoji: '🇨🇿',
    text: 'Czech Republic',
    value: 'CZ'
  },
  {
    emoji: '🇩🇪',
    text: 'Germany',
    value: 'DE'
  },
  {
    emoji: '🇨🇮',
    text: "Cote d'ivoire",
    value: 'CI'
  },
  {
    emoji: '🇩🇯',
    text: 'Djibouti',
    value: 'DJ'
  },
  {
    emoji: '🇩🇰',
    text: 'Denmark',
    value: 'DK'
  },
  {
    emoji: '🇩🇲',
    text: 'Dominica',
    value: 'DM'
  },
  {
    emoji: '🇩🇴',
    text: 'Dominican Republic',
    value: 'DO'
  },
  {
    emoji: '🇩🇿',
    text: 'Algeria',
    value: 'DZ'
  },
  {
    emoji: '🇪🇨',
    text: 'Ecuador',
    value: 'EC'
  },
  {
    emoji: '🇪🇪',
    text: 'Estonia',
    value: 'EE'
  },
  {
    emoji: '🇪🇬',
    text: 'Egypt',
    value: 'EG'
  },
  {
    emoji: '🇪🇭',
    text: 'Western Sahara',
    value: 'EH'
  },
  {
    emoji: '🇪🇸',
    text: 'Spain',
    value: 'ES'
  },
  {
    emoji: '🇪🇹',
    text: 'Ethiopia',
    value: 'ET'
  },
  {
    emoji: '🇫🇮',
    text: 'Finland',
    value: 'FI'
  },
  {
    emoji: '🇫🇯',
    text: 'Fiji',
    value: 'FJ'
  },
  {
    emoji: '🇫🇰',
    text: 'Falkland Islands (Malvinas)',
    value: 'FK'
  },
  {
    emoji: '🇫🇲',
    text: 'Micronesia',
    value: 'FM'
  },
  {
    emoji: '🇫🇴',
    text: 'Faroe Islands',
    value: 'FO'
  },
  {
    emoji: '🇫🇷',
    text: 'France',
    value: 'FR'
  },
  {
    emoji: '🇬🇦',
    text: 'Gabon',
    value: 'GA'
  },
  {
    emoji: '🇬🇧',
    text: 'United Kingdom',
    value: 'GB'
  },
  {
    emoji: '🇬🇩',
    text: 'Grenada',
    value: 'GD'
  },
  {
    emoji: '🇬🇪',
    text: 'Georgia',
    value: 'GE'
  },
  {
    emoji: '🇬🇫',
    text: 'French Guiana',
    value: 'GF'
  },
  {
    emoji: '🇬🇬',
    text: 'Guernsey',
    value: 'GG'
  },
  {
    emoji: '🇬🇭',
    text: 'Ghana',
    value: 'GH'
  },
  {
    emoji: '🇬🇮',
    text: 'Gibraltar',
    value: 'GI'
  },
  {
    emoji: '🇬🇱',
    text: 'Greenland',
    value: 'GL'
  },
  {
    emoji: '🇬🇲',
    text: 'Gambia',
    value: 'GM'
  },
  {
    emoji: '🇬🇵',
    text: 'Guadeloupe',
    value: 'GP'
  },
  {
    emoji: '🇬🇷',
    text: 'Greece',
    value: 'GR'
  },
  {
    emoji: '🇬🇸',
    text: 'South Georgia',
    value: 'GS'
  },
  {
    emoji: '🇬🇹',
    text: 'Guatemala',
    value: 'GT'
  },
  {
    emoji: '🇬🇺',
    text: 'Guam',
    value: 'GU'
  },
  {
    emoji: '🇬🇾',
    text: 'Guyana',
    value: 'GY'
  },
  {
    emoji: '🇭🇰',
    text: 'Hong Kong',
    value: 'HK'
  },
  {
    emoji: '🇭🇲',
    text: 'Heard Island and Mcdonald Islands',
    value: 'HM'
  },
  {
    emoji: '🇭🇳',
    text: 'Honduras',
    value: 'HN'
  },

  {
    emoji: '🇭🇷',
    text: 'Croatia',
    value: 'HR'
  },
  {
    emoji: '🇭🇹',
    text: 'Haiti',
    value: 'HT'
  },
  {
    emoji: '🇭🇺',
    text: 'Hungary',
    value: 'HU'
  },
  {
    emoji: '🇮🇩',
    text: 'Indonesia',
    value: 'ID'
  },
  {
    emoji: '🇮🇪',
    text: 'Ireland',
    value: 'IE'
  },
  {
    emoji: '🇮🇱',
    text: 'Israel',
    value: 'IL'
  },
  {
    emoji: '🇮🇲',
    text: 'Isle of Man',
    value: 'IM'
  },
  {
    emoji: '🇮🇳',
    text: 'India',
    value: 'IN'
  },
  {
    emoji: '🇮🇴',
    text: 'British Indian Ocean Territory',
    value: 'IO'
  },
  {
    emoji: '🇮🇸',
    text: 'Iceland',
    value: 'IS'
  },
  {
    emoji: '🇮🇹',
    text: 'Italy',
    value: 'IT'
  },
  {
    emoji: '🇯🇪',
    text: 'Jersey',
    value: 'JE'
  },
  {
    emoji: '🇯🇲',
    text: 'Jamaica',
    value: 'JM'
  },
  {
    emoji: '🇯🇴',
    text: 'Jordan',
    value: 'JO'
  },
  {
    emoji: '🇯🇵',
    text: 'Japan',
    value: 'JP'
  },
  {
    emoji: '🇰🇪',
    text: 'Kenya',
    value: 'KE'
  },

  {
    emoji: '🇰🇬',
    text: 'Kyrgyzstan',
    value: 'KG'
  },
  {
    emoji: '🇰🇭',
    text: 'Cambodia',
    value: 'KH'
  },
  {
    emoji: '🇰🇮',
    text: 'Kiribati',
    value: 'KI'
  },
  {
    emoji: '🇰🇲',
    text: 'Comoros',
    value: 'KM'
  },
  {
    emoji: '🇰🇳',
    text: 'Saint Kitts and Nevis',
    value: 'KN'
  },
  {
    emoji: '🇰🇷',
    text: 'South Korea',
    value: 'KR'
  },
  {
    emoji: '🇰🇼',
    text: 'Kuwait',
    value: 'KW'
  },
  {
    emoji: '🇰🇾',
    text: 'Cayman Islands',
    value: 'KY'
  },
  {
    emoji: '🇰🇿',
    text: 'Kazakhstan',
    value: 'KZ'
  },
  {
    emoji: '🇱🇦',
    text: "Lao People's Democratic Republic",
    value: 'LA'
  },
  {
    emoji: '🇱🇨',
    text: 'Saint Lucia',
    value: 'LC'
  },
  {
    emoji: '🇱🇮',
    text: 'Liechtenstein',
    value: 'LI'
  },
  {
    emoji: '🇱🇰',
    text: 'Sri Lanka',
    value: 'LK'
  },
  {
    emoji: '🇱🇸',
    text: 'Lesotho',
    value: 'LS'
  },
  {
    emoji: '🇱🇹',
    text: 'Lithuania',
    value: 'LT'
  },
  {
    emoji: '🇱🇺',
    text: 'Luxembourg',
    value: 'LU'
  },

  {
    emoji: '🇱🇻',
    text: 'Latvia',
    value: 'LV'
  },
  {
    emoji: '🇲🇦',
    text: 'Morocco',
    value: 'MA'
  },
  {
    emoji: '🇲🇨',
    text: 'Monaco',
    value: 'MC'
  },
  {
    emoji: '🇲🇩',
    text: 'Moldova',
    value: 'MD'
  },
  {
    emoji: '🇲🇪',
    text: 'Montenegro',
    value: 'ME'
  },
  {
    emoji: '🇲🇫',
    text: 'Saint Martin (French Part)',
    value: 'MF'
  },
  {
    emoji: '🇲🇬',
    text: 'Madagascar',
    value: 'MG'
  },
  {
    emoji: '🇲🇭',
    text: 'Marshall Islands',
    value: 'MH'
  },
  {
    emoji: '🇲🇰',
    text: 'Macedonia',
    value: 'MK'
  },
  {
    emoji: '🇲🇱',
    text: 'Mali',
    value: 'ML'
  },
  {
    emoji: '🇲🇳',
    text: 'Mongolia',
    value: 'MN'
  },
  {
    emoji: '🇲🇴',
    text: 'Macao',
    value: 'MO'
  },
  {
    emoji: '🇲🇵',
    text: 'Northern Mariana Islands',
    value: 'MP'
  },
  {
    emoji: '🇲🇶',
    text: 'Martinique',
    value: 'MQ'
  },
  {
    emoji: '🇲🇷',
    text: 'Mauritania',
    value: 'MR'
  },
  {
    emoji: '🇲🇸',
    text: 'Montserrat',
    value: 'MS'
  },
  {
    emoji: '🇲🇹',
    text: 'Malta',
    value: 'MT'
  },
  {
    emoji: '🇲🇺',
    text: 'Mauritius',
    value: 'MU'
  },
  {
    emoji: '🇲🇻',
    text: 'Maldives',
    value: 'MV'
  },
  {
    emoji: '🇲🇼',
    text: 'Malawi',
    value: 'MW'
  },
  {
    emoji: '🇲🇽',
    text: 'Mexico',
    value: 'MX'
  },
  {
    emoji: '🇲🇾',
    text: 'Malaysia',
    value: 'MY'
  },
  {
    emoji: '🇲🇿',
    text: 'Mozambique',
    value: 'MZ'
  },
  {
    emoji: '🇳🇦',
    text: 'Namibia',
    value: 'NA'
  },
  {
    emoji: '🇳🇨',
    text: 'New Caledonia',
    value: 'NC'
  },
  {
    emoji: '🇳🇪',
    text: 'Niger',
    value: 'NE'
  },
  {
    emoji: '🇳🇫',
    text: 'Norfolk Island',
    value: 'NF'
  },
  {
    emoji: '🇳🇬',
    text: 'Nigeria',
    value: 'NG'
  },
  {
    emoji: '🇳🇮',
    text: 'Nicaragua',
    value: 'NI'
  },
  {
    emoji: '🇳🇱',
    text: 'Netherlands',
    value: 'NL'
  },
  {
    emoji: '🇳🇴',
    text: 'Norway',
    value: 'NO'
  },
  {
    emoji: '🇳🇵',
    text: 'Nepal',
    value: 'NP'
  },
  {
    emoji: '🇳🇷',
    text: 'Nauru',
    value: 'NR'
  },
  {
    emoji: '🇳🇺',
    text: 'Niue',
    value: 'NU'
  },
  {
    emoji: '🇳🇿',
    text: 'New Zealand',
    value: 'NZ'
  },
  {
    emoji: '🇴🇲',
    text: 'Oman',
    value: 'OM'
  },
  {
    emoji: '🇵🇦',
    text: 'Panama',
    value: 'PA'
  },
  {
    emoji: '🇵🇪',
    text: 'Peru',
    value: 'PE'
  },
  {
    emoji: '🇵🇫',
    text: 'French Polynesia',
    value: 'PF'
  },
  {
    emoji: '🇵🇬',
    text: 'Papua New Guinea',
    value: 'PG'
  },
  {
    emoji: '🇵🇭',
    text: 'Philippines',
    value: 'PH'
  },
  {
    emoji: '🇵🇰',
    text: 'Pakistan',
    value: 'PK'
  },
  {
    emoji: '🇵🇱',
    text: 'Poland',
    value: 'PL'
  },
  {
    emoji: '🇵🇲',
    text: 'Saint Pierre and Miquelon',
    value: 'PM'
  },
  {
    emoji: '🇵🇳',
    text: 'Pitcairn',
    value: 'PN'
  },
  {
    emoji: '🇵🇷',
    text: 'Puerto Rico',
    value: 'PR'
  },
  {
    emoji: '🇵🇸',
    text: 'Palestinian Territory',
    value: 'PS'
  },
  {
    emoji: '🇵🇹',
    text: 'Portugal',
    value: 'PT'
  },
  {
    emoji: '🇵🇼',
    text: 'Palau',
    value: 'PW'
  },
  {
    emoji: '🇵🇾',
    text: 'Paraguay',
    value: 'PY'
  },
  {
    emoji: '🇷🇺',
    text: 'Russia',
    value: 'RU'
  },
  {
    emoji: '🇶🇦',
    text: 'Qatar',
    value: 'QA'
  },
  {
    emoji: '🇷🇪',
    text: 'Réunion',
    value: 'RE'
  },
  {
    emoji: '🇷🇴',
    text: 'Romania',
    value: 'RO'
  },
  {
    emoji: '🇷🇸',
    text: 'Serbia',
    value: 'RS'
  },
  {
    emoji: '🇷🇼',
    text: 'Rwanda',
    value: 'RW'
  },
  {
    emoji: '🇸🇦',
    text: 'Saudi Arabia',
    value: 'SA'
  },
  {
    emoji: '🇸🇧',
    text: 'Solomon Islands',
    value: 'SB'
  },
  {
    emoji: '🇸🇨',
    text: 'Seychelles',
    value: 'SC'
  },
  {
    emoji: '🇸🇪',
    text: 'Sweden',
    value: 'SE'
  },
  {
    emoji: '🇸🇬',
    text: 'Singapore',
    value: 'SG'
  },
  {
    emoji: '🇸🇭',
    text: 'Saint Helena, Ascension and Tristan Da Cunha',
    value: 'SH'
  },
  {
    emoji: '🇸🇮',
    text: 'Slovenia',
    value: 'SI'
  },
  {
    emoji: '🇸🇰',
    text: 'Slovakia',
    value: 'SK'
  },
  {
    emoji: '🇸🇱',
    text: 'Sierra Leone',
    value: 'SL'
  },
  {
    emoji: '🇸🇲',
    text: 'San Marino',
    value: 'SM'
  },
  {
    emoji: '🇸🇳',
    text: 'Senegal',
    value: 'SN'
  },
  {
    emoji: '🇸🇷',
    text: 'Suriname',
    value: 'SR'
  },
  {
    emoji: '🇸🇹',
    text: 'Sao Tome and Principe',
    value: 'ST'
  },
  {
    emoji: '🇸🇻',
    text: 'El Salvador',
    value: 'SV'
  },
  {
    emoji: '🇸🇽',
    text: 'Sint Maarten (Dutch Part)',
    value: 'SX'
  },
  {
    emoji: '🇸🇿',
    text: 'Swaziland',
    value: 'SZ'
  },
  {
    emoji: '🇹🇳',
    text: 'Tunisia',
    value: 'TN'
  },
  {
    emoji: '🇹🇨',
    text: 'Turks and Caicos Islands',
    value: 'TC'
  },
  {
    emoji: '🇹🇩',
    text: 'Chad',
    value: 'TD'
  },
  {
    emoji: '🇹🇫',
    text: 'French Southern Territories',
    value: 'TF'
  },
  {
    emoji: '🇹🇬',
    text: 'Togo',
    value: 'TG'
  },
  {
    emoji: '🇹🇭',
    text: 'Thailand',
    value: 'TH'
  },
  {
    emoji: '🇹🇯',
    text: 'Tajikistan',
    value: 'TJ'
  },
  {
    emoji: '🇹🇰',
    text: 'Tokelau',
    value: 'TK'
  },
  {
    emoji: '🇹🇱',
    text: 'Timor-Leste',
    value: 'TL'
  },
  {
    emoji: '🇹🇲',
    text: 'Turkmenistan',
    value: 'TM'
  },
  {
    emoji: '🇹🇴',
    text: 'Tonga',
    value: 'TO'
  },
  {
    emoji: '🇹🇷',
    text: 'Turkey',
    value: 'TR'
  },
  {
    emoji: '🇹🇹',
    text: 'Trinidad and Tobago',
    value: 'TT'
  },
  {
    emoji: '🇹🇻',
    text: 'Tuvalu',
    value: 'TV'
  },
  {
    emoji: '🇹🇼',
    text: 'Taiwan',
    value: 'TW'
  },
  {
    emoji: '🇹🇿',
    text: 'Tanzania',
    value: 'TZ'
  },
  {
    emoji: '🇺🇦',
    text: 'Ukraine',
    value: 'UA'
  },
  {
    emoji: '🇺🇬',
    text: 'Uganda',
    value: 'UG'
  },
  {
    emoji: '🇺🇲',
    text: 'United States Minor Outlying Islands',
    value: 'UM'
  },
  {
    emoji: '🇺🇸',
    text: 'United States',
    value: 'US'
  },
  {
    emoji: '🇺🇾',
    text: 'Uruguay',
    value: 'UY'
  },
  {
    emoji: '🇺🇿',
    text: 'Uzbekistan',
    value: 'UZ'
  },
  {
    emoji: '🇻🇨',
    text: 'Saint Vincent and The Grenadines',
    value: 'VC'
  },
  {
    emoji: '🇻🇬',
    text: 'Virgin Islands, British',
    value: 'VG'
  },
  {
    emoji: '🇻🇳',
    text: 'Viet Nam',
    value: 'VN'
  },
  {
    emoji: '🇻🇺',
    text: 'Vanuatu',
    value: 'VU'
  },
  {
    emoji: '🇻🇪',
    text: 'Venezuela',
    value: 'VE'
  },
  {
    emoji: '🇼🇫',
    text: 'Wallis and Futuna',
    value: 'WF'
  },
  {
    emoji: '🇼🇸',
    text: 'Samoa',
    value: 'WS'
  },
  {
    emoji: '🇾🇹',
    text: 'Mayotte',
    value: 'YT'
  },
  {
    emoji: '🇿🇦',
    text: 'South Africa',
    value: 'ZA'
  },
  {
    emoji: '🇿🇲',
    text: 'Zambia',
    value: 'ZM'
  },
  {
    emoji: '🇿🇼',
    text: 'Zimbabwe',
    value: 'ZW'
  }
]

type Props = {
  blackList?: string[]
  whiteList?: string[]
}

const applyWhiteBlackList = (whiteList: string[] | null, blackList: string[] | null) => {
  if (blackList && whiteList) {
    throw new Error(whiteBlackListsConflictMessage)
  }
  let allCountries = countries

  if (blackList) {
    allCountries = allCountries.filter((item) => blackList.includes(item.value))
  }
  if (whiteList) {
    allCountries = allCountries.filter((item) => !whiteList.includes(item.value))
  }

  // we order all countries on text
  return allCountries.sort(function (a, b) {
    if (a.text < b.text) {
      return -1
    }
    if (a.text > b.text) {
      return 1
    }
    return 0
  })
}

const SelectBoxCountry = (props: Props) => {
  const { blackList = null, whiteList = null, ...rest } = props
  const elements = [
    {
      group: '',
      items: applyWhiteBlackList(whiteList, blackList)
    }
  ]

  return (
    <SelectBox
      label={
        <FormattedMessage id='components.selectboxcountry.label' defaultMessage='Select country' />
      }
      elements={elements}
      {...rest}
    />
  )
}

export default SelectBoxCountry
