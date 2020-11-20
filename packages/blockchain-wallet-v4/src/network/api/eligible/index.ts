import { FiatType } from 'core/types'
import { PaymentMethod, ProductEligibleResponse, ProductTypes } from './types'

export default ({ nabuUrl, authorizedGet }) => {
  const fetchIsProductEligible = (
    product: ProductTypes,
    currency: FiatType
  ): ProductEligibleResponse =>
    authorizedGet({
      url: nabuUrl,
      endPoint: `/eligible/product/${product}${
        currency ? `?currency=${currency}` : ''
      }`
    })

  const fetchEligiblePaymentMethods = (
    eligibleOnly: string,
    currency: string,
    tier: string
  ): PaymentMethod[] => {
    const queryObj = {
      eligibleOnly,
      currency,
      tier
    }
    const parameters = new URLSearchParams(queryObj).toString()

    return authorizedGet({
      url: nabuUrl,
      endPoint: `/eligible/payment-methods${parameters ? `?${parameters}` : ''}`
    })
  }

  return {
    fetchIsProductEligible,
    fetchEligiblePaymentMethods
  }
}
