import { ProductType } from 'data/components/debitCard/types'

export default ({ authorizedGet, authorizedPost, nabuUrl }) => {
  const createDCOrder = (productCode: string): string =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        productCode
      },
      endPoint: '/card-issuing/cards',
      url: nabuUrl
    })

  const getDCProducts = (): Array<ProductType> =>
    authorizedGet({
      endPoint: '/card-issuing/products',
      url: nabuUrl
    })

  return {
    createDCOrder,
    getDCProducts
  }
}
