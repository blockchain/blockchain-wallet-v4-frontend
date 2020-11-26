import { SDDType, SDDVerifiedType } from './types'

export default ({ nabuUrl, authorizedGet, get }) => {
  const fetchSDDEligible = (): SDDType =>
    get({
      url: nabuUrl,
      endPoint: `/sdd/eligible`,
      ignoreQueryParams: true
    })

  const updateSDDEligible = (): SDDVerifiedType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: `/sdd/verified`,
      contentType: 'application/json',
      ignoreQueryParams: true
    })

  return {
    fetchSDDEligible,
    updateSDDEligible
  }
}
