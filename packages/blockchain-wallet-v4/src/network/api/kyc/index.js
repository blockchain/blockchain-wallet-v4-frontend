export default ({ apiUrl, get, post }) => {
  const getSupportedCountries = () =>
    // get({
    //   url: apiUrl,
    //   endPoint: '/kyc/config/countries'
    // })
    Promise.resolve([
      {
        UK: 'United Kingdom'
      },
      {
        US: 'United States'
      }
    ])

  const getAddressesByZipcode = postcode =>
    // get({
    //   url: apiUrl,
    //   endPoint: `/addresses/find`
    //   data: { postcode }
    // })
    Promise.resolve([
      {
        city: 'London',
        line1: '41 Great Street',
        line2: '42 Car Court',
        country: 'United Kingdom',
        postCode: 'E145AB'
      },
      {
        city: 'London',
        line1: '41 Great Street',
        line2: '42 Car Court',
        country: 'United Kingdom',
        postCode: 'E145AB'
      }
    ])

  const fetchOnfidoSDKKey = () =>
    // get({
    //   url: apiUrl,
    //   endPoint: '/kyc/credentials/ONFIDO'
    // })
    Promise.resolve({
      key: ''
    })

  const syncOnfido = applicantId =>
    // post({
    //   url: apiUrl,
    //   endPoint: '/kyc/verification',
    //   data: { applicantId }
    // })
    Promise.resolve({
      applicantId: '4ad8273f-e028-4d4c-b258-0349eb88308c'
    })

  return {
    getSupportedCountries,
    getAddressesByZipcode,
    fetchOnfidoSDKKey,
    syncOnfido
  }
}
