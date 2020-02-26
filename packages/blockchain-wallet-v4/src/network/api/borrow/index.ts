import { CoinType } from 'core/types'
import { LoanType, OfferType } from './types'

export default ({ nabuUrl, authorizedGet, authorizedPost, authorizedPut }) => {
  const getOffers = (): Array<OfferType> =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/lending/offers'
    })

  const getUserBorrowHistory = (): Array<LoanType> =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/user/loans'
    })

  const closeLoanWithPrincipal = (
    loan: LoanType,
    collateralWithdrawAddresses: { [key in CoinType]?: string }
  ): { loan: LoanType } =>
    authorizedPost({
      url: nabuUrl,
      endPoint: `/user/loans/${loan.loanId}/close_with_principal`,
      data: {
        collateralWithdrawAddresses
      }
    })

  const createLoan = (
    offerId: string,
    principalAmount: { symbol: CoinType; value: string },
    principalWithdrawAddresses: { [key in CoinType]?: string }
  ): { loan: LoanType } =>
    authorizedPost({
      url: nabuUrl,
      endPoint: '/user/loans',
      contentType: 'application/json',
      data: {
        offerId,
        principalAmount,
        principalWithdrawAddresses
      }
    })

  return {
    getOffers,
    getUserBorrowHistory,
    closeLoanWithPrincipal,
    createLoan
  }
}
