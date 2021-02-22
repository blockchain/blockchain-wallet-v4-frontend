import { ProductEligibility } from 'data/types'

export default ({ authorizedGet, nabuUrl }) => {
  const getProductsEligiblity = (): ProductEligibility[] =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/eligible/products'
    })

  return {
    getProductsEligiblity
  }
}
