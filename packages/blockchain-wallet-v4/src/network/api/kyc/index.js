export default ({ nabuUrl, get, authorizedGet, authorizedPost }) => {
  const getSupportedCountries = () =>
    get({
      url: nabuUrl,
      endPoint: '/countries',
      data: { scope: 'kyc' }
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

  const syncOnfido = applicantId =>
    authorizedPost({
      url: nabuUrl,
      endPoint: '/kyc/verifications',
      data: { applicantId }
    })

  return {
    getSupportedCountries,
    fetchKycAddresses,
    fetchOnfidoSDKKey,
    syncOnfido
  }
}
