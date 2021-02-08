import { ProductEligibility } from 'data/types'
import { WalletCurrencyType } from 'core/types'

export default ({ authorizedGet, nabuUrl }) => {
  const getProductsEligiblity = (
    currency: keyof WalletCurrencyType
  ): ProductEligibility[] =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/eligible/products',
      data: {
        currency
      }
    })

  return {
    getProductsEligiblity
  }
}
