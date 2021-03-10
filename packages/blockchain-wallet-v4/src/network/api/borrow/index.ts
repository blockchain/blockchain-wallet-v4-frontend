import { CoinType } from 'core/types'

import { LoanTransactionsType, LoanType, MoneyType, OfferType } from './types'

export default ({ authorizedGet, authorizedPost, nabuUrl }) => {
  const closeLoanWithPrincipal = (
    loan: LoanType,
    collateralWithdrawAddresses: { [key in CoinType]?: string }
  ): { loan: LoanType } =>
    authorizedPost({
      url: nabuUrl,
      endPoint: `/user/loans/${loan.loanId}/close_with_principal`,
      contentType: 'application/json',
      data: {
        collateralWithdrawAddresses
      }
    })

  const createLoan = (
    offerId: string,
    principalAmount: MoneyType,
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

  const getLoanFinancials = (loanId: string) =>
    authorizedGet({
      url: nabuUrl,
      endPoint: `/user/loans/${loanId}/financials`
    })

  const getLoanTransactions = (
    loanId: string
  ): { transactions: Array<LoanTransactionsType> } =>
    authorizedGet({
      url: nabuUrl,
      endPoint: `/user/loans/${loanId}/transactions`
    })

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

  const notifyLoanDeposit = (
    loanId: string,
    amount: MoneyType,
    dstAddress: string,
    status: 'REQUESTED' | 'FAILED',
    type: 'DEPOSIT_COLLATERAL' | 'DEPOSIT_PRINCIPAL_AND_INTEREST'
  ): { loan: LoanType } =>
    authorizedPost({
      url: nabuUrl,
      endPoint: `/user/loans/${loanId}/deposit`,
      contentType: 'application/json',
      data: {
        amount,
        dstAddress,
        status,
        type
      }
    })

  return {
    closeLoanWithPrincipal,
    createLoan,
    getLoanFinancials,
    getLoanTransactions,
    getOffers,
    getUserBorrowHistory,
    notifyLoanDeposit
  }
}
