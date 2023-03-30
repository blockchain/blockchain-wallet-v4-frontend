export default {
  blocking: true,
  context: 'TIER_TWO_VERIFICATION',
  nodes: [
    {
      children: [
        {
          checked: false,
          id: 'INITIAL_SET-q1-a1',
          text: 'Buy cryptocurrency',
          type: 'SELECTION'
        },
        {
          checked: false,
          id: 'INITIAL_SET-q1-a2',
          text: 'Trade cryptocurrencies',
          type: 'SELECTION'
        },
        {
          checked: false,
          id: 'INITIAL_SET-q1-a3',
          text: 'Send cryptocurrencies to third parties',
          type: 'SELECTION'
        },
        {
          checked: false,
          id: 'INITIAL_SET-q1-a4',
          text: 'Business',
          type: 'SELECTION'
        }
      ],
      id: 'INITIAL_SET-q1',
      instructions: '(Select all that apply)',
      text: 'Nature & Purpose of Business Relationship',
      type: 'MULTIPLE_SELECTION'
    },
    {
      children: [
        {
          checked: false,
          id: 'INITIAL_SET-q2-a1',
          text: 'Salary',
          type: 'SELECTION'
        },
        {
          checked: false,
          id: 'INITIAL_SET-q2-a2',
          text: 'Crypto Trading',
          type: 'SELECTION'
        },
        {
          checked: false,
          id: 'INITIAL_SET-q2-a3',
          text: 'Crypto Mining',
          type: 'SELECTION'
        },
        {
          checked: false,
          id: 'INITIAL_SET-q2-a4',
          text: 'Investment Income',
          type: 'SELECTION'
        },
        {
          checked: false,
          id: 'INITIAL_SET-q2-a5',
          text: 'Real Estate',
          type: 'SELECTION'
        },
        {
          checked: false,
          id: 'INITIAL_SET-q2-a6',
          text: 'Inheritance',
          type: 'SELECTION'
        },
        {
          checked: false,
          id: 'INITIAL_SET-q2-a7',
          text: 'Family',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [
            {
              hint: 'Enter source of funds here',
              id: 'INITIAL_SET-q2-a8-a1',
              input: '',
              text: '',
              type: 'OPEN_ENDED'
            }
          ],
          id: 'INITIAL_SET-q2-a8',
          text: 'Other',
          type: 'SELECTION'
        }
      ],
      id: 'INITIAL_SET-q2',
      instructions: '(Select only one)',
      isDropdown: true,
      text: 'Source of funds',
      type: 'SINGLE_SELECTION'
    },
    {
      children: [
        {
          checked: false,
          id: 'INITIAL_SET-q3-a1',
          text: 'Yes',
          type: 'SELECTION'
        },
        {
          checked: false,
          id: 'INITIAL_SET-q3-a2',
          text: 'No',
          type: 'SELECTION'
        }
      ],
      id: 'INITIAL_SET-q3',
      instructions: '(Select only one)',
      isDropdown: true,
      text: 'Are you acting on your own behalf?',
      type: 'SINGLE_SELECTION'
    },
    {
      children: [
        {
          checked: false,
          id: 'INITIAL_SET-q4-a1',
          text: 'No',
          type: 'SELECTION'
        },
        {
          checked: false,
          id: 'INITIAL_SET-q4-a2',
          text: 'Yes, I am',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [
            {
              hint: 'John Smith',
              id: 'INITIAL_SET-q4-a3-a1',
              input: '',
              text: 'Name, Last Name',
              type: 'OPEN_ENDED'
            },
            {
              hint: 'Family Member',
              id: 'INITIAL_SET-q4-a3-a2',
              input: '',
              text: 'Their Relation To You',
              type: 'OPEN_ENDED'
            }
          ],
          id: 'INITIAL_SET-q4-a3',
          text: 'Yes, My Family Member Or Close Associate Is',
          type: 'SELECTION'
        }
      ],
      id: 'INITIAL_SET-q4',
      instructions: '(Select only one)',
      text: 'Are you a Politically Exposed Person (PEP)',
      type: 'SINGLE_SELECTION'
    },
    {
      children: [
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a1-AFG',
          text: 'Afghanistan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a2-ALB',
          text: 'Albania',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a3-DZA',
          text: 'Algeria',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a4-ASM',
          text: 'American Samoa',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a5-AND',
          text: 'Andorra',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a6-AGO',
          text: 'Angola',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a7-AIA',
          text: 'Anguilla',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a8-ATA',
          text: 'Antarctica',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a9-ATG',
          text: 'Antigua and Barbuda',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a10-ARG',
          text: 'Argentina',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a11-ARM',
          text: 'Armenia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a12-ABW',
          text: 'Aruba',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a13-AUS',
          text: 'Australia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a14-AUT',
          text: 'Austria',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a15-AZE',
          text: 'Azerbaijan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a16-BHS',
          text: 'Bahamas',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a17-BHR',
          text: 'Bahrain',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a18-BGD',
          text: 'Bangladesh',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a19-BRB',
          text: 'Barbados',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a20-BLR',
          text: 'Belarus',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a21-BEL',
          text: 'Belgium',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a22-BLZ',
          text: 'Belize',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a23-BEN',
          text: 'Benin',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a24-BMU',
          text: 'Bermuda',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a25-BTN',
          text: 'Bhutan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a26-BOL',
          text: 'Bolivia, Plurinational State of',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a27-BES',
          text: 'Bonaire, Sint Eustatius and Saba',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a28-BIH',
          text: 'Bosnia and Herzegovina',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a29-BWA',
          text: 'Botswana',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a30-BVT',
          text: 'Bouvet Island',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a31-BRA',
          text: 'Brazil',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a32-IOT',
          text: 'British Indian Ocean Territory',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a33-BRN',
          text: 'Brunei Darussalam',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a34-BGR',
          text: 'Bulgaria',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a35-BFA',
          text: 'Burkina Faso',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a36-BDI',
          text: 'Burundi',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a37-KHM',
          text: 'Cambodia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a38-CMR',
          text: 'Cameroon',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a39-CAN',
          text: 'Canada',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a40-CPV',
          text: 'Cape Verde',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a41-CYM',
          text: 'Cayman Islands',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a42-CAF',
          text: 'Central African Republic',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a43-TCD',
          text: 'Chad',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a44-CHL',
          text: 'Chile',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a45-CHN',
          text: 'China',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a46-CXR',
          text: 'Christmas Island',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a47-CCK',
          text: 'Cocos (Keeling) Islands',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a48-COL',
          text: 'Colombia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a49-COM',
          text: 'Comoros',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a50-COG',
          text: 'Congo',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a51-COD',
          text: 'Congo, the Democratic Republic of the',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a52-COK',
          text: 'Cook Islands',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a53-CRI',
          text: 'Costa Rica',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a54-HRV',
          text: 'Croatia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a55-CUB',
          text: 'Cuba',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a56-CUW',
          text: 'Curaçao',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a57-CYP',
          text: 'Cyprus',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a58-CZE',
          text: 'Czech Republic',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a59-CIV',
          text: "Côte d'Ivoire",
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a60-DNK',
          text: 'Denmark',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a61-DJI',
          text: 'Djibouti',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a62-DMA',
          text: 'Dominica',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a63-DOM',
          text: 'Dominican Republic',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a64-ECU',
          text: 'Ecuador',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a65-EGY',
          text: 'Egypt',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a66-SLV',
          text: 'El Salvador',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a67-GNQ',
          text: 'Equatorial Guinea',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a68-ERI',
          text: 'Eritrea',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a69-EST',
          text: 'Estonia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a70-SWZ',
          text: 'Eswatini',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a71-ETH',
          text: 'Ethiopia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a72-FLK',
          text: 'Falkland Islands (Malvinas)',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a73-FRO',
          text: 'Faroe Islands',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a74-FJI',
          text: 'Fiji',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a75-FIN',
          text: 'Finland',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a76-FRA',
          text: 'France',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a77-GUF',
          text: 'French Guiana',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a78-PYF',
          text: 'French Polynesia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a79-ATF',
          text: 'French Southern Territories',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a80-GAB',
          text: 'Gabon',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a81-GMB',
          text: 'Gambia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a82-GEO',
          text: 'Georgia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a83-DEU',
          text: 'Germany',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a84-GHA',
          text: 'Ghana',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a85-GIB',
          text: 'Gibraltar',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a86-GRC',
          text: 'Greece',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a87-GRL',
          text: 'Greenland',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a88-GRD',
          text: 'Grenada',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a89-GLP',
          text: 'Guadeloupe',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a90-GUM',
          text: 'Guam',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a91-GTM',
          text: 'Guatemala',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a92-GGY',
          text: 'Guernsey',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a93-GIN',
          text: 'Guinea',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a94-GNB',
          text: 'Guinea-Bissau',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a95-GUY',
          text: 'Guyana',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a96-HTI',
          text: 'Haiti',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a97-HMD',
          text: 'Heard Island and McDonald Islands',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a98-VAT',
          text: 'Holy See (Vatican City State)',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a99-HND',
          text: 'Honduras',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a100-HKG',
          text: 'Hong Kong',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a101-HUN',
          text: 'Hungary',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a102-ISL',
          text: 'Iceland',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a103-IND',
          text: 'India',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a104-IDN',
          text: 'Indonesia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a105-IRN',
          text: 'Iran, Islamic Republic of',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a106-IRQ',
          text: 'Iraq',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a107-IRL',
          text: 'Ireland',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a108-IMN',
          text: 'Isle of Man',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a109-ISR',
          text: 'Israel',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a110-ITA',
          text: 'Italy',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a111-JAM',
          text: 'Jamaica',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a112-JPN',
          text: 'Japan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a113-JEY',
          text: 'Jersey',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a114-JOR',
          text: 'Jordan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a115-KAZ',
          text: 'Kazakhstan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a116-KEN',
          text: 'Kenya',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a117-KIR',
          text: 'Kiribati',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a118-PRK',
          text: "Korea, Democratic People's Republic of",
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a119-KOR',
          text: 'Korea, Republic of',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a120-KWT',
          text: 'Kuwait',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a121-KGZ',
          text: 'Kyrgyzstan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a122-LAO',
          text: "Lao People's Democratic Republic",
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a123-LVA',
          text: 'Latvia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a124-LBN',
          text: 'Lebanon',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a125-LSO',
          text: 'Lesotho',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a126-LBR',
          text: 'Liberia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a127-LBY',
          text: 'Libya',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a128-LIE',
          text: 'Liechtenstein',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a129-LTU',
          text: 'Lithuania',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a130-LUX',
          text: 'Luxembourg',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a131-MAC',
          text: 'Macao',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a132-MDG',
          text: 'Madagascar',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a133-MWI',
          text: 'Malawi',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a134-MYS',
          text: 'Malaysia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a135-MDV',
          text: 'Maldives',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a136-MLI',
          text: 'Mali',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a137-MLT',
          text: 'Malta',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a138-MHL',
          text: 'Marshall Islands',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a139-MTQ',
          text: 'Martinique',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a140-MRT',
          text: 'Mauritania',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a141-MUS',
          text: 'Mauritius',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a142-MYT',
          text: 'Mayotte',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a143-MEX',
          text: 'Mexico',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a144-FSM',
          text: 'Micronesia, Federated States of',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a145-MDA',
          text: 'Moldova, Republic of',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a146-MCO',
          text: 'Monaco',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a147-MNG',
          text: 'Mongolia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a148-MNE',
          text: 'Montenegro',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a149-MSR',
          text: 'Montserrat',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a150-MAR',
          text: 'Morocco',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a151-MOZ',
          text: 'Mozambique',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a152-MMR',
          text: 'Myanmar',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a153-NAM',
          text: 'Namibia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a154-NRU',
          text: 'Nauru',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a155-NPL',
          text: 'Nepal',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a156-NLD',
          text: 'Netherlands',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a157-NCL',
          text: 'New Caledonia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a158-NZL',
          text: 'New Zealand',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a159-NIC',
          text: 'Nicaragua',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a160-NER',
          text: 'Niger',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a161-NGA',
          text: 'Nigeria',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a162-NIU',
          text: 'Niue',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a163-NFK',
          text: 'Norfolk Island',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a164-MKD',
          text: 'North Macedonia, Republic of',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a165-MNP',
          text: 'Northern Mariana Islands',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a166-NOR',
          text: 'Norway',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a167-OMN',
          text: 'Oman',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a168-PAK',
          text: 'Pakistan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a169-PLW',
          text: 'Palau',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a170-PSE',
          text: 'Palestine, State of',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a171-PAN',
          text: 'Panama',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a172-PNG',
          text: 'Papua New Guinea',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a173-PRY',
          text: 'Paraguay',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a174-PER',
          text: 'Peru',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a175-PHL',
          text: 'Philippines',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a176-PCN',
          text: 'Pitcairn',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a177-POL',
          text: 'Poland',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a178-PRT',
          text: 'Portugal',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a179-PRI',
          text: 'Puerto Rico',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a180-QAT',
          text: 'Qatar',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a181-ROU',
          text: 'Romania',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a182-RUS',
          text: 'Russian Federation',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a183-RWA',
          text: 'Rwanda',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a184-REU',
          text: 'Réunion',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a185-BLM',
          text: 'Saint Barthélemy',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a186-SHN',
          text: 'Saint Helena, Ascension and Tristan da Cunha',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a187-KNA',
          text: 'Saint Kitts and Nevis',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a188-LCA',
          text: 'Saint Lucia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a189-MAF',
          text: 'Saint Martin (French part)',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a190-SPM',
          text: 'Saint Pierre and Miquelon',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a191-VCT',
          text: 'Saint Vincent and the Grenadines',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a192-WSM',
          text: 'Samoa',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a193-SMR',
          text: 'San Marino',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a194-STP',
          text: 'Sao Tome and Principe',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a195-SAU',
          text: 'Saudi Arabia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a196-SEN',
          text: 'Senegal',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a197-SRB',
          text: 'Serbia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a198-SYC',
          text: 'Seychelles',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a199-SLE',
          text: 'Sierra Leone',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a200-SGP',
          text: 'Singapore',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a201-SXM',
          text: 'Sint Maarten (Dutch part)',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a202-SVK',
          text: 'Slovakia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a203-SVN',
          text: 'Slovenia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a204-SLB',
          text: 'Solomon Islands',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a205-SOM',
          text: 'Somalia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a206-ZAF',
          text: 'South Africa',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a207-SGS',
          text: 'South Georgia and the South Sandwich Islands',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a208-SSD',
          text: 'South Sudan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a209-ESP',
          text: 'Spain',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a210-LKA',
          text: 'Sri Lanka',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a211-SDN',
          text: 'Sudan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a212-SUR',
          text: 'Suriname',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a213-SJM',
          text: 'Svalbard and Jan Mayen',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a214-SWE',
          text: 'Sweden',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a215-CHE',
          text: 'Switzerland',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a216-SYR',
          text: 'Syrian Arab Republic',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a217-TWN',
          text: 'Taiwan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a218-TJK',
          text: 'Tajikistan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a219-TZA',
          text: 'Tanzania, United Republic of',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a220-THA',
          text: 'Thailand',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a221-TLS',
          text: 'Timor-Leste',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a222-TGO',
          text: 'Togo',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a223-TKL',
          text: 'Tokelau',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a224-TON',
          text: 'Tonga',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a225-TTO',
          text: 'Trinidad and Tobago',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a226-TUN',
          text: 'Tunisia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a227-TUR',
          text: 'Turkey',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a228-TKM',
          text: 'Turkmenistan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a229-TCA',
          text: 'Turks and Caicos Islands',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a230-TUV',
          text: 'Tuvalu',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a231-UGA',
          text: 'Uganda',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a232-UKR',
          text: 'Ukraine',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a233-ARE',
          text: 'United Arab Emirates',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a234-GBR',
          text: 'United Kingdom',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a235-USA',
          text: 'United States',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a236-UMI',
          text: 'United States Minor Outlying Islands',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a237-URY',
          text: 'Uruguay',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a238-UZB',
          text: 'Uzbekistan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a239-VUT',
          text: 'Vanuatu',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a240-VEN',
          text: 'Venezuela, Bolivarian Republic of',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a241-VNM',
          text: 'Viet Nam',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a242-VGB',
          text: 'Virgin Islands, British',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a243-VIR',
          text: 'Virgin Islands, U.S.',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a244-WLF',
          text: 'Wallis and Futuna',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a245-ESH',
          text: 'Western Sahara',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a246-YEM',
          text: 'Yemen',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a247-ZMB',
          text: 'Zambia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a248-ZWE',
          text: 'Zimbabwe',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_V2-q1-a249-ALA',
          text: 'Åland Islands',
          type: 'SELECTION'
        }
      ],
      id: 'CITIZENSHIP_SET_V2-q1',
      instructions: '(Select one option)',
      isDropdown: true,
      text: 'Select your citizenship',
      type: 'SINGLE_SELECTION'
    },
    {
      children: [
        {
          checked: true,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a0-OPTIONAL',
          text: ' ',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a1-AFG',
          text: 'Afghanistan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a2-ALB',
          text: 'Albania',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a3-DZA',
          text: 'Algeria',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a4-ASM',
          text: 'American Samoa',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a5-AND',
          text: 'Andorra',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a6-AGO',
          text: 'Angola',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a7-AIA',
          text: 'Anguilla',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a8-ATA',
          text: 'Antarctica',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a9-ATG',
          text: 'Antigua and Barbuda',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a10-ARG',
          text: 'Argentina',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a11-ARM',
          text: 'Armenia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a12-ABW',
          text: 'Aruba',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a13-AUS',
          text: 'Australia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a14-AUT',
          text: 'Austria',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a15-AZE',
          text: 'Azerbaijan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a16-BHS',
          text: 'Bahamas',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a17-BHR',
          text: 'Bahrain',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a18-BGD',
          text: 'Bangladesh',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a19-BRB',
          text: 'Barbados',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a20-BLR',
          text: 'Belarus',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a21-BEL',
          text: 'Belgium',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a22-BLZ',
          text: 'Belize',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a23-BEN',
          text: 'Benin',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a24-BMU',
          text: 'Bermuda',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a25-BTN',
          text: 'Bhutan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a26-BOL',
          text: 'Bolivia, Plurinational State of',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a27-BES',
          text: 'Bonaire, Sint Eustatius and Saba',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a28-BIH',
          text: 'Bosnia and Herzegovina',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a29-BWA',
          text: 'Botswana',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a30-BVT',
          text: 'Bouvet Island',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a31-BRA',
          text: 'Brazil',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a32-IOT',
          text: 'British Indian Ocean Territory',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a33-BRN',
          text: 'Brunei Darussalam',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a34-BGR',
          text: 'Bulgaria',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a35-BFA',
          text: 'Burkina Faso',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a36-BDI',
          text: 'Burundi',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a37-KHM',
          text: 'Cambodia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a38-CMR',
          text: 'Cameroon',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a39-CAN',
          text: 'Canada',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a40-CPV',
          text: 'Cape Verde',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a41-CYM',
          text: 'Cayman Islands',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a42-CAF',
          text: 'Central African Republic',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a43-TCD',
          text: 'Chad',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a44-CHL',
          text: 'Chile',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a45-CHN',
          text: 'China',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a46-CXR',
          text: 'Christmas Island',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a47-CCK',
          text: 'Cocos (Keeling) Islands',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a48-COL',
          text: 'Colombia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a49-COM',
          text: 'Comoros',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a50-COG',
          text: 'Congo',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a51-COD',
          text: 'Congo, the Democratic Republic of the',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a52-COK',
          text: 'Cook Islands',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a53-CRI',
          text: 'Costa Rica',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a54-HRV',
          text: 'Croatia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a55-CUB',
          text: 'Cuba',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a56-CUW',
          text: 'Curaçao',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a57-CYP',
          text: 'Cyprus',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a58-CZE',
          text: 'Czech Republic',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a59-CIV',
          text: "Côte d'Ivoire",
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a60-DNK',
          text: 'Denmark',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a61-DJI',
          text: 'Djibouti',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a62-DMA',
          text: 'Dominica',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a63-DOM',
          text: 'Dominican Republic',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a64-ECU',
          text: 'Ecuador',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a65-EGY',
          text: 'Egypt',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a66-SLV',
          text: 'El Salvador',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a67-GNQ',
          text: 'Equatorial Guinea',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a68-ERI',
          text: 'Eritrea',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a69-EST',
          text: 'Estonia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a70-SWZ',
          text: 'Eswatini',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a71-ETH',
          text: 'Ethiopia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a72-FLK',
          text: 'Falkland Islands (Malvinas)',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a73-FRO',
          text: 'Faroe Islands',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a74-FJI',
          text: 'Fiji',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a75-FIN',
          text: 'Finland',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a76-FRA',
          text: 'France',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a77-GUF',
          text: 'French Guiana',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a78-PYF',
          text: 'French Polynesia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a79-ATF',
          text: 'French Southern Territories',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a80-GAB',
          text: 'Gabon',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a81-GMB',
          text: 'Gambia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a82-GEO',
          text: 'Georgia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a83-DEU',
          text: 'Germany',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a84-GHA',
          text: 'Ghana',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a85-GIB',
          text: 'Gibraltar',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a86-GRC',
          text: 'Greece',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a87-GRL',
          text: 'Greenland',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a88-GRD',
          text: 'Grenada',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a89-GLP',
          text: 'Guadeloupe',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a90-GUM',
          text: 'Guam',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a91-GTM',
          text: 'Guatemala',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a92-GGY',
          text: 'Guernsey',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a93-GIN',
          text: 'Guinea',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a94-GNB',
          text: 'Guinea-Bissau',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a95-GUY',
          text: 'Guyana',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a96-HTI',
          text: 'Haiti',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a97-HMD',
          text: 'Heard Island and McDonald Islands',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a98-VAT',
          text: 'Holy See (Vatican City State)',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a99-HND',
          text: 'Honduras',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a100-HKG',
          text: 'Hong Kong',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a101-HUN',
          text: 'Hungary',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a102-ISL',
          text: 'Iceland',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a103-IND',
          text: 'India',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a104-IDN',
          text: 'Indonesia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a105-IRN',
          text: 'Iran, Islamic Republic of',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a106-IRQ',
          text: 'Iraq',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a107-IRL',
          text: 'Ireland',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a108-IMN',
          text: 'Isle of Man',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a109-ISR',
          text: 'Israel',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a110-ITA',
          text: 'Italy',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a111-JAM',
          text: 'Jamaica',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a112-JPN',
          text: 'Japan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a113-JEY',
          text: 'Jersey',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a114-JOR',
          text: 'Jordan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a115-KAZ',
          text: 'Kazakhstan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a116-KEN',
          text: 'Kenya',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a117-KIR',
          text: 'Kiribati',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a118-PRK',
          text: "Korea, Democratic People's Republic of",
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a119-KOR',
          text: 'Korea, Republic of',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a120-KWT',
          text: 'Kuwait',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a121-KGZ',
          text: 'Kyrgyzstan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a122-LAO',
          text: "Lao People's Democratic Republic",
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a123-LVA',
          text: 'Latvia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a124-LBN',
          text: 'Lebanon',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a125-LSO',
          text: 'Lesotho',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a126-LBR',
          text: 'Liberia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a127-LBY',
          text: 'Libya',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a128-LIE',
          text: 'Liechtenstein',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a129-LTU',
          text: 'Lithuania',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a130-LUX',
          text: 'Luxembourg',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a131-MAC',
          text: 'Macao',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a132-MDG',
          text: 'Madagascar',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a133-MWI',
          text: 'Malawi',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a134-MYS',
          text: 'Malaysia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a135-MDV',
          text: 'Maldives',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a136-MLI',
          text: 'Mali',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a137-MLT',
          text: 'Malta',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a138-MHL',
          text: 'Marshall Islands',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a139-MTQ',
          text: 'Martinique',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a140-MRT',
          text: 'Mauritania',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a141-MUS',
          text: 'Mauritius',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a142-MYT',
          text: 'Mayotte',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a143-MEX',
          text: 'Mexico',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a144-FSM',
          text: 'Micronesia, Federated States of',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a145-MDA',
          text: 'Moldova, Republic of',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a146-MCO',
          text: 'Monaco',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a147-MNG',
          text: 'Mongolia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a148-MNE',
          text: 'Montenegro',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a149-MSR',
          text: 'Montserrat',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a150-MAR',
          text: 'Morocco',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a151-MOZ',
          text: 'Mozambique',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a152-MMR',
          text: 'Myanmar',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a153-NAM',
          text: 'Namibia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a154-NRU',
          text: 'Nauru',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a155-NPL',
          text: 'Nepal',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a156-NLD',
          text: 'Netherlands',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a157-NCL',
          text: 'New Caledonia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a158-NZL',
          text: 'New Zealand',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a159-NIC',
          text: 'Nicaragua',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a160-NER',
          text: 'Niger',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a161-NGA',
          text: 'Nigeria',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a162-NIU',
          text: 'Niue',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a163-NFK',
          text: 'Norfolk Island',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a164-MKD',
          text: 'North Macedonia, Republic of',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a165-MNP',
          text: 'Northern Mariana Islands',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a166-NOR',
          text: 'Norway',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a167-OMN',
          text: 'Oman',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a168-PAK',
          text: 'Pakistan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a169-PLW',
          text: 'Palau',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a170-PSE',
          text: 'Palestine, State of',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a171-PAN',
          text: 'Panama',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a172-PNG',
          text: 'Papua New Guinea',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a173-PRY',
          text: 'Paraguay',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a174-PER',
          text: 'Peru',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a175-PHL',
          text: 'Philippines',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a176-PCN',
          text: 'Pitcairn',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a177-POL',
          text: 'Poland',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a178-PRT',
          text: 'Portugal',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a179-PRI',
          text: 'Puerto Rico',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a180-QAT',
          text: 'Qatar',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a181-ROU',
          text: 'Romania',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a182-RUS',
          text: 'Russian Federation',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a183-RWA',
          text: 'Rwanda',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a184-REU',
          text: 'Réunion',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a185-BLM',
          text: 'Saint Barthélemy',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a186-SHN',
          text: 'Saint Helena, Ascension and Tristan da Cunha',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a187-KNA',
          text: 'Saint Kitts and Nevis',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a188-LCA',
          text: 'Saint Lucia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a189-MAF',
          text: 'Saint Martin (French part)',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a190-SPM',
          text: 'Saint Pierre and Miquelon',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a191-VCT',
          text: 'Saint Vincent and the Grenadines',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a192-WSM',
          text: 'Samoa',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a193-SMR',
          text: 'San Marino',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a194-STP',
          text: 'Sao Tome and Principe',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a195-SAU',
          text: 'Saudi Arabia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a196-SEN',
          text: 'Senegal',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a197-SRB',
          text: 'Serbia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a198-SYC',
          text: 'Seychelles',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a199-SLE',
          text: 'Sierra Leone',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a200-SGP',
          text: 'Singapore',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a201-SXM',
          text: 'Sint Maarten (Dutch part)',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a202-SVK',
          text: 'Slovakia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a203-SVN',
          text: 'Slovenia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a204-SLB',
          text: 'Solomon Islands',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a205-SOM',
          text: 'Somalia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a206-ZAF',
          text: 'South Africa',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a207-SGS',
          text: 'South Georgia and the South Sandwich Islands',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a208-SSD',
          text: 'South Sudan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a209-ESP',
          text: 'Spain',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a210-LKA',
          text: 'Sri Lanka',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a211-SDN',
          text: 'Sudan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a212-SUR',
          text: 'Suriname',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a213-SJM',
          text: 'Svalbard and Jan Mayen',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a214-SWE',
          text: 'Sweden',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a215-CHE',
          text: 'Switzerland',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a216-SYR',
          text: 'Syrian Arab Republic',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a217-TWN',
          text: 'Taiwan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a218-TJK',
          text: 'Tajikistan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a219-TZA',
          text: 'Tanzania, United Republic of',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a220-THA',
          text: 'Thailand',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a221-TLS',
          text: 'Timor-Leste',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a222-TGO',
          text: 'Togo',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a223-TKL',
          text: 'Tokelau',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a224-TON',
          text: 'Tonga',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a225-TTO',
          text: 'Trinidad and Tobago',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a226-TUN',
          text: 'Tunisia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a227-TUR',
          text: 'Turkey',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a228-TKM',
          text: 'Turkmenistan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a229-TCA',
          text: 'Turks and Caicos Islands',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a230-TUV',
          text: 'Tuvalu',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a231-UGA',
          text: 'Uganda',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a232-UKR',
          text: 'Ukraine',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a233-ARE',
          text: 'United Arab Emirates',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a234-GBR',
          text: 'United Kingdom',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a235-USA',
          text: 'United States',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a236-UMI',
          text: 'United States Minor Outlying Islands',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a237-URY',
          text: 'Uruguay',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a238-UZB',
          text: 'Uzbekistan',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a239-VUT',
          text: 'Vanuatu',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a240-VEN',
          text: 'Venezuela, Bolivarian Republic of',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a241-VNM',
          text: 'Viet Nam',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a242-VGB',
          text: 'Virgin Islands, British',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a243-VIR',
          text: 'Virgin Islands, U.S.',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a244-WLF',
          text: 'Wallis and Futuna',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a245-ESH',
          text: 'Western Sahara',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a246-YEM',
          text: 'Yemen',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a247-ZMB',
          text: 'Zambia',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a248-ZWE',
          text: 'Zimbabwe',
          type: 'SELECTION'
        },
        {
          checked: false,
          children: [],
          id: 'CITIZENSHIP_SET_OPTIONAL-q1-a249-ALA',
          text: 'Åland Islands',
          type: 'SELECTION'
        }
      ],
      id: 'CITIZENSHIP_SET_OPTIONAL-q1',
      instructions: '(Select one option)',
      isDropdown: true,
      text: 'If you have another citizenship, please select (optional)',
      type: 'SINGLE_SELECTION'
    }
  ]
}
