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
      endPoint: '/user/e4d5f3cb-3416-4507-8f71-8ad5e11a86b0/loans',
      contentType: 'application/json',
      data: {
        offerId,
        principalAmount
      }
    })

  return {
    createLoan,
    getOffers
  }
}
