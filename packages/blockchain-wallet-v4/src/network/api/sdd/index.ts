import { FiatType } from 'core/types'
import { SDDType, SDDUpdateType } from './types'

export default ({ nabuUrl, authorizedPost, get }) => {
  const fetchSDDEligible = (): SDDType =>
    get({
      url: nabuUrl,
      endPoint: `/sdd/eligible`,
      ignoreQueryParams: true
    })

  const updateSDDEligible = (
    amount: number,
    currency: FiatType
  ): SDDUpdateType =>
    authorizedPost({
      url: nabuUrl,
      endPoint: `/sdd/verified`,
      contentType: 'application/json',
      removeDefaultPostData: true,
      data: {
        amount,
        currency
      }
    })

  return {
    fetchSDDEligible,
    updateSDDEligible
  }
}
