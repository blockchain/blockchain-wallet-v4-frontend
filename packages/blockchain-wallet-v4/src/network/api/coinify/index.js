export default ({ coinifyUrl, get, post }) => {
  const getCoinifyStates = () =>
    Promise.resolve([
      { code: 'US-AL', countryCode: 'US', name: 'Alabama', scopes: ['KYC'] },
      { code: 'US-AK', countryCode: 'US', name: 'Alaska', scopes: ['KYC'] },
      { code: 'US-AZ', countryCode: 'US', name: 'Arizona', scopes: ['KYC'] },
      { code: 'US-AR', countryCode: 'US', name: 'Arkansas', scopes: ['KYC'] },
      { code: 'US-CA', countryCode: 'US', name: 'California', scopes: ['KYC'] },
      { code: 'US-CO', countryCode: 'US', name: 'Colorado', scopes: ['KYC'] },
      { code: 'US-CT', countryCode: 'US', name: 'Connecticut', scopes: [] },
      { code: 'US-DE', countryCode: 'US', name: 'Delaware', scopes: ['KYC'] },
      { code: 'US-FL', countryCode: 'US', name: 'Florida', scopes: [] },
      { code: 'US-GA', countryCode: 'US', name: 'Georgia', scopes: ['KYC'] },
      { code: 'US-HI', countryCode: 'US', name: 'Hawaii', scopes: [] },
      { code: 'US-ID', countryCode: 'US', name: 'Idaho', scopes: ['KYC'] },
      { code: 'US-IL', countryCode: 'US', name: 'Illinois', scopes: ['KYC'] },
      { code: 'US-IN', countryCode: 'US', name: 'Indiana', scopes: ['KYC'] },
      { code: 'US-IA', countryCode: 'US', name: 'Iowa', scopes: ['KYC'] },
      { code: 'US-KS', countryCode: 'US', name: 'Kansas', scopes: ['KYC'] },
      { code: 'US-KY', countryCode: 'US', name: 'Kentucky', scopes: ['KYC'] },
      { code: 'US-LA', countryCode: 'US', name: 'Louisiana', scopes: ['KYC'] },
      { code: 'US-ME', countryCode: 'US', name: 'Maine', scopes: ['KYC'] },
      { code: 'US-MD', countryCode: 'US', name: 'Maryland', scopes: ['KYC'] },
      {
        code: 'US-MA',
        countryCode: 'US',
        name: 'Massachusetts',
        scopes: ['KYC']
      },
      { code: 'US-MI', countryCode: 'US', name: 'Michigan', scopes: ['KYC'] },
      { code: 'US-MN', countryCode: 'US', name: 'Minnesota', scopes: ['KYC'] },
      {
        code: 'US-MS',
        countryCode: 'US',
        name: 'Mississippi',
        scopes: ['KYC']
      },
      { code: 'US-MO', countryCode: 'US', name: 'Missouri', scopes: ['KYC'] },
      { code: 'US-MT', countryCode: 'US', name: 'Montana', scopes: ['KYC'] },
      { code: 'US-NE', countryCode: 'US', name: 'Nebraska', scopes: [] },
      { code: 'US-NV', countryCode: 'US', name: 'Nevada', scopes: ['KYC'] },
      {
        code: 'US-NH',
        countryCode: 'US',
        name: 'New Hampshire',
        scopes: ['KYC']
      },
      { code: 'US-NJ', countryCode: 'US', name: 'New Jersey', scopes: ['KYC'] },
      { code: 'US-NM', countryCode: 'US', name: 'New Mexico', scopes: [] },
      { code: 'US-NY', countryCode: 'US', name: 'New York', scopes: [] },
      {
        code: 'US-NC',
        countryCode: 'US',
        name: 'North Carolina',
        scopes: ['KYC']
      },
      {
        code: 'US-ND',
        countryCode: 'US',
        name: 'North Dakota',
        scopes: ['KYC']
      },
      { code: 'US-OH', countryCode: 'US', name: 'Ohio', scopes: ['KYC'] },
      { code: 'US-OK', countryCode: 'US', name: 'Oklahoma', scopes: ['KYC'] },
      { code: 'US-OR', countryCode: 'US', name: 'Oregon', scopes: [] },
      {
        code: 'US-PA',
        countryCode: 'US',
        name: 'Pennsylvania',
        scopes: ['KYC']
      },
      {
        code: 'US-RI',
        countryCode: 'US',
        name: 'Rhode Island',
        scopes: ['KYC']
      },
      {
        code: 'US-SC',
        countryCode: 'US',
        name: 'South Carolina',
        scopes: ['KYC']
      },
      {
        code: 'US-SD',
        countryCode: 'US',
        name: 'South Dakota',
        scopes: ['KYC']
      },
      { code: 'US-TN', countryCode: 'US', name: 'Tennessee', scopes: ['KYC'] },
      { code: 'US-TX', countryCode: 'US', name: 'Texas', scopes: ['KYC'] },
      { code: 'US-UT', countryCode: 'US', name: 'Utah', scopes: ['KYC'] },
      { code: 'US-VT', countryCode: 'US', name: 'Vermont', scopes: [] },
      { code: 'US-VA', countryCode: 'US', name: 'Virginia', scopes: ['KYC'] },
      { code: 'US-WA', countryCode: 'US', name: 'Washington', scopes: [] },
      {
        code: 'US-WV',
        countryCode: 'US',
        name: 'West Virginia',
        scopes: ['KYC']
      },
      { code: 'US-WI', countryCode: 'US', name: 'Wisconsin', scopes: ['KYC'] },
      { code: 'US-WY', countryCode: 'US', name: 'Wyoming', scopes: ['KYC'] },
      {
        code: 'US-AS',
        countryCode: 'US',
        name: 'American Samoa',
        scopes: ['KYC']
      },
      {
        code: 'US-DC',
        countryCode: 'US',
        name: 'District of Columbia',
        scopes: ['KYC']
      },
      { code: 'US-GU', countryCode: 'US', name: 'Guam', scopes: ['KYC'] },
      {
        code: 'US-MP',
        countryCode: 'US',
        name: 'Northern Mariana Islands',
        scopes: ['KYC']
      },
      {
        code: 'US-PR',
        countryCode: 'US',
        name: 'Puerto Rico',
        scopes: ['KYC']
      },
      {
        code: 'US-UM',
        countryCode: 'US',
        name: 'United States Minor Outlying Islands',
        scopes: []
      },
      {
        code: 'US-VI',
        countryCode: 'US',
        name: 'Virgin Islands, U.S.',
        scopes: ['KYC']
      }
    ])

  return {
    getCoinifyStates
  }
}
