export default ({ nabuUrl, get, post }) => {
  const getSupportedCountries = () =>
    get({
      url: nabuUrl,
      endPoint: '/countries',
      data: { filter: 'eea' }
    })

  const fetchKycAddresses = (filter, cancelToken) =>
    get({
      url: nabuUrl,
      endPoint: `/addresses/find`,
      data: { ...filter },
      cancelToken
    })

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
    fetchKycAddresses,
    fetchOnfidoSDKKey,
    syncOnfido
  }
}
