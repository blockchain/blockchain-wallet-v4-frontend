import { DebitCardType, ProductType } from 'data/components/debitCard/types'

export default ({ authorizedDelete, authorizedGet, authorizedPost, authorizedPut, nabuUrl }) => {
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

  const handleDCLock = (cardId, action) =>
    authorizedPut({
      contentType: 'application/json',
      endPoint: `/card-issuing/cards/${cardId}/${action}`,
      url: nabuUrl
    })

  const terminateDC = (cardId) =>
    authorizedDelete({
      contentType: 'application/json',
      endPoint: `/card-issuing/cards/${cardId}`,
      url: nabuUrl
    })

  const getDCEligibleAccounts = (cardId) =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: `/card-issuing/cards/${cardId}/eligible-accounts`,
      url: nabuUrl
    })

  const getDCCurrentAccount = (cardId) =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: `/card-issuing/cards/${cardId}/account`,
      url: nabuUrl
    })

  const selectDCAccount = (cardId, accountCurrency) =>
    authorizedPut({
      contentType: 'application/json',
      data: {
        accountCurrency
      },
      endPoint: `/card-issuing/cards/${cardId}/account`,
      url: nabuUrl
    })

  const getDCTransactions = (cardId) =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: `/card-issuing/transactions${cardId ? `?cardId=${cardId}&` : ''}`,
      url: nabuUrl
    })

  return {
    createDCOrder,
    getDCCreated,
    getDCCurrentAccount,
    getDCEligibleAccounts,
    getDCProducts,
    getDCToken,
    getDCTransactions,
    handleDCLock,
    selectDCAccount,
    terminateDC
  }
}
