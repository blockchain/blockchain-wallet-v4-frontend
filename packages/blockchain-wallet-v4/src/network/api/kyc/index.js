export default ({ nabuUrl, get, authorizedGet, authorizedPost }) => {
  const getSupportedCountries = () =>
    get({
      url: nabuUrl,
      endPoint: '/countries',
      data: { scope: 'kyc' }
    })

  const getStates = () =>
    get({
      url: nabuUrl,
      endPoint: '/countries/US/states'
    })

  const fetchKycAddresses = (filter, cancelToken) =>
    authorizedGet({
      url: nabuUrl,
      endPoint: `/addresses/find`,
      data: { ...filter },
      cancelToken
    })

  const fetchOnfidoSDKKey = () =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/kyc/credentials/ONFIDO',
      headers: {
        'x-client-type': 'WEB'
      }
    })

  const syncOnfido = (applicantId, isSelfie) => {
    return authorizedPost({
      url: nabuUrl,
      endPoint: '/kyc/verifications',
      contentType: 'application/json',
      data: { applicantId },
      headers: {
        'x-client-type': isSelfie ? 'WEB' : 'APP'
      }
    })
  }

  return {
    getSupportedCountries,
    getStates,
    fetchKycAddresses,
    fetchOnfidoSDKKey,
    syncOnfido
  }
}
