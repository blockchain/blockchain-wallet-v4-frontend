import { CoinType } from 'blockchain-wallet-v4/src/types'

export default ({ nabuUrl, authorizedGet, authorizedPost, authorizedPut }) => {
  const getOffers = () =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/lending/offers'
    })

  const createLoan = (
    offerId: string,
    principalAmount: { symbol: CoinType; value: string }
  ) =>
    authorizedPost({
      url: nabuUrl,
      endPoint: '/user/53d0ec26-2e0c-4cf5-aa94-f5822b21270f/loans',
      contentType: 'application/json',
      data: {
        offerId,
        principalAmount
      }
    })

  const getUserBorrowHistory = () =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/user/53d0ec26-2e0c-4cf5-aa94-f5822b21270f/loans'
    })

  return {
    createLoan,
    getOffers,
    getUserBorrowHistory
  }
}
