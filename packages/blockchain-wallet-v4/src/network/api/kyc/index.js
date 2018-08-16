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
      endPoint: '/kyc/credentials/ONFIDO'
    })

  const syncOnfido = applicantId =>
    authorizedPost({
      url: nabuUrl,
      endPoint: '/kyc/verification',
      data: { applicantId }
    })

  return {
    getSupportedCountries,
    fetchKycAddresses,
    fetchOnfidoSDKKey,
    syncOnfido
  }
}
