import { CoinType } from 'blockchain-wallet-v4/src/types'
import { LoanType } from './types'

export default ({ nabuUrl, authorizedGet, authorizedPost, authorizedPut }) => {
  const getOffers = (): Array<LoanType> =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/lending/offers'
    })

  const createLoan = (
    collateralWithdrawAddress: string,
    offerId: string,
    principalAmount: { symbol: CoinType; value: string },
    principalWithdrawAddress: string
  ): LoanType =>
    authorizedPost({
      url: nabuUrl,
      endPoint: '/user/loans',
      contentType: 'application/json',
      data: {
        collateralWithdrawAddress,
        offerId,
        principalAmount,
        principalWithdrawAddress
      }
    })

  const getUserBorrowHistory = () =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/user/loans'
    })

  return {
    createLoan,
    getOffers,
    getUserBorrowHistory
  }
}
