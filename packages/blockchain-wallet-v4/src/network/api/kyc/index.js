export default ({ nabuUrl, get, post, authorizedGet, authorizedPost }) => {
  const getSupportedCountries = () =>
    get({
      url: nabuUrl,
      endPoint: '/countries',
      data: { scope: 'kyc' }
    })

  const getSupportedDocuments = countryCode =>
    authorizedGet({
      url: nabuUrl,
      endPoint: `/kyc/supported-documents/${countryCode}`
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

  const fetchUploadData = token =>
    get({
      url: nabuUrl,
      endPoint: `/upload/data/${token}`
    })

  const fetchVeriffUrl = () =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/kyc/credentials/veriff',
      headers: { 'x-client-type': 'WEB' }
    })

  const syncVeriff = applicantId =>
    authorizedPost({
      url: nabuUrl,
      endPoint: '/kyc/verifications',
      contentType: 'application/json',
      data: { applicantId },
      headers: { 'x-client-type': 'WEB' }
    })

  const uploadDocuments = (token, data) =>
    post({
      contentType: 'application/json',
      data: { data },
      endPoint: `/upload/${token}`,
      url: nabuUrl
    })

  const fetchKycConfig = () =>
    authorizedGet({
      url: nabuUrl,
      contentType: 'application/json',
      endPoint: '/kyc/configuration',
      headers: { 'x-client-type': 'WEB' }
    })

  const fetchTiers = () =>
    authorizedGet({
      url: nabuUrl,
      contentType: 'application/json',
      endPoint: '/kyc/tiers'
    })

  const selectTier = selectedTier =>
    authorizedPost({
      url: nabuUrl,
      contentType: 'application/json',
      endPoint: '/kyc/tiers',
      ignoreQueryParams: true,
      data: { selectedTier }
    })

  const sendDeeplink = () =>
    authorizedPost({
      url: nabuUrl,
      contentType: 'application/json',
      endPoint: '/kyc/verifications/mobile-email'
    })

  return {
    getSupportedCountries,
    getSupportedDocuments,
    getStates,
    fetchKycAddresses,
    fetchKycConfig,
    fetchOnfidoSDKKey,
    fetchUploadData,
    fetchTiers,
    fetchVeriffUrl,
    selectTier,
    sendDeeplink,
    syncOnfido,
    syncVeriff,
    uploadDocuments
  }
}
