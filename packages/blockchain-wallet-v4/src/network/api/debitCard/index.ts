import { DebitCardType, ProductType } from 'data/components/debitCard/types'

export default ({ authorizedDelete, authorizedGet, authorizedPost, authorizedPut, nabuUrl }) => {
  const createDCOrder = ({
    productCode,
    ssn
  }: {
    productCode: string
    ssn: string
  }): DebitCardType =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        productCode,
        ssn
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

  const getDCResidentialAddress = () => {
    return authorizedGet({
      contentType: 'application/json',
      endPoint: '/card-issuing/residential-address',
      url: nabuUrl
    })
  }

  const setDCResidentialAddress = (address) => {
    return authorizedPut({
      contentType: 'application/json',
      data: { address },
      endPoint: '/card-issuing/residential-address',
      url: nabuUrl
    })
  }

  const setDCSocialSecurityNumber = (address) => {
    return authorizedPut({
      contentType: 'application/json',
      data: { address },
      endPoint: '/card-issuing/residential-address',
      url: nabuUrl
    })
  }

  return {
    createDCOrder,
    getDCCreated,
    getDCCurrentAccount,
    getDCEligibleAccounts,
    getDCProducts,
    getDCResidentialAddress,
    getDCToken,
    getDCTransactions,
    handleDCLock,
    selectDCAccount,
    setDCResidentialAddress,
    terminateDC
  }
}
