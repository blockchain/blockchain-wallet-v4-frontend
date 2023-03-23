import { CountryScopeType, ExtraQuestionsType, KycFlowsType, VerifiedType } from './types'

export default ({ authorizedGet, authorizedPost, authorizedPut, get, nabuUrl, post }) => {
  const getSupportedCountries = (scope: CountryScopeType) =>
    get({
      data: { scope },
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

  const sendDeepLink = () =>
    authorizedPost({
      contentType: 'application/json',
      endPoint: '/kyc/verifications/mobile-email',
      url: nabuUrl
    })

  const fetchKYCExtraQuestions = (context): ExtraQuestionsType =>
    authorizedGet({
      contentType: 'application/json',
      data: { context },
      endPoint: '/kyc/extra-questions',
      ignoreQueryParams: false,
      url: nabuUrl
    })

  const updateKYCExtraQuestions = (extraQuestions: ExtraQuestionsType): VerifiedType =>
    authorizedPut({
      contentType: 'application/json',
      data: { context: extraQuestions.context, nodes: extraQuestions.nodes },
      endPoint: '/kyc/extra-questions',
      ignoreQueryParams: true,
      url: nabuUrl
    })

  const fetchKYCFlows = (entryPoint?: string): KycFlowsType =>
    authorizedGet({
      contentType: 'application/json',
      data: { entryPoint },
      endPoint: '/flows/kyc',
      ignoreQueryParams: false,
      url: nabuUrl
    })

  return {
    fetchKYCExtraQuestions,
    fetchKYCFlows,
    fetchKycAddresses,
    fetchKycConfig,
    fetchPreIdvData,
    fetchTiers,
    fetchUploadData,
    fetchVeriffUrl,
    getStates,
    getSupportedCountries,
    getSupportedDocuments,
    selectTier,
    sendDeepLink,
    syncVeriff,
    updateKYCExtraQuestions,
    uploadDocuments
  }
}
