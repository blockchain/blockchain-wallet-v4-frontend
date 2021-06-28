import { SDDEligibleType, SDDVerifiedType } from './types'

export default ({ authorizedGet, authorizedPost, get, nabuUrl, post }) => {
  const getSupportedCountries = () =>
    get({
      data: { scope: 'kyc' },
      endPoint: '/countries',
      url: nabuUrl
    })

  const getSupportedDocuments = (countryCode) =>
    authorizedGet({
      endPoint: `/kyc/supported-documents/${countryCode}`,
      url: nabuUrl
    })

  const getStates = () =>
    get({
      endPoint: '/countries/US/states',
      url: nabuUrl
    })

  const fetchKycAddresses = (filter, cancelToken) =>
    authorizedGet({
      cancelToken,
      data: { ...filter },
      endPoint: `/addresses/find`,
      url: nabuUrl
    })

  const fetchUploadData = (token) =>
    get({
      endPoint: `/upload/data/${token}`,
      url: nabuUrl
    })

  const fetchSDDEligible = (): SDDEligibleType =>
    get({
      endPoint: `/sdd/eligible`,
      ignoreQueryParams: true,
      url: nabuUrl
    })

  const fetchVeriffUrl = () =>
    authorizedGet({
      endPoint: '/kyc/credentials/veriff',
      headers: { 'x-client-type': 'WEB' },
      url: nabuUrl
    })

  const syncVeriff = (applicantId) =>
    authorizedPost({
      contentType: 'application/json',
      data: { applicantId },
      endPoint: '/kyc/verifications',
      headers: { 'x-client-type': 'WEB' },
      url: nabuUrl
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
      contentType: 'application/json',
      endPoint: '/kyc/configuration',
      headers: { 'x-client-type': 'WEB' },
      url: nabuUrl
    })

  const fetchPreIdvData = () =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: '/kyc/sift/session',
      url: nabuUrl
    })

  const fetchTiers = () =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: '/kyc/tiers',
      url: nabuUrl
    })

  const selectTier = (selectedTier) =>
    authorizedPost({
      contentType: 'application/json',
      data: { selectedTier },
      endPoint: '/kyc/tiers',
      ignoreQueryParams: true,
      url: nabuUrl
    })

  const sendDeeplink = () =>
    authorizedPost({
      contentType: 'application/json',
      endPoint: '/kyc/verifications/mobile-email',
      url: nabuUrl
    })

  const fetchSDDVerified = (): SDDVerifiedType =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: `/sdd/verified`,
      ignoreQueryParams: true,
      url: nabuUrl
    })

  return {
    fetchKycAddresses,
    fetchKycConfig,
    fetchPreIdvData,
    fetchSDDEligible,
    fetchSDDVerified,
    fetchTiers,
    fetchUploadData,
    fetchVeriffUrl,
    getStates,
    getSupportedCountries,
    getSupportedDocuments,
    selectTier,
    sendDeeplink,
    syncVeriff,
    uploadDocuments
  }
}
