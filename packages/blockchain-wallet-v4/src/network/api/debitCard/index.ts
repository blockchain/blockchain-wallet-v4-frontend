import { DebitCardType, ProductType } from 'data/components/debitCard/types'

export default ({ authorizedGet, authorizedPost, nabuUrl }) => {
  const createDCOrder = (productCode: string): DebitCardType =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        productCode,
        ssn: 111111110 // TODO: Hardcoded for testing purpose. Waiting for designs to get this value from a form
      },
      endPoint: '/card-issuing/cards',
      url: nabuUrl
    })

  const getDCCreated = (): Array<DebitCardType> =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: '/card-issuing/cards',
      url: nabuUrl
    })

  const getDCProducts = (): Array<ProductType> =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: '/card-issuing/products',
      url: nabuUrl
    })

  const getDCToken = (cardId) =>
    authorizedPost({
      contentType: 'application/json',
      endPoint: `/card-issuing/cards/${cardId}/marqeta-card-widget-token`,
      url: nabuUrl
    })

  return {
    createDCOrder,
    getDCCreated,
    getDCProducts,
    getDCToken
  }
}
