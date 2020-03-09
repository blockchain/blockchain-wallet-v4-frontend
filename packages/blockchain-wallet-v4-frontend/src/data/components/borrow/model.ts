import { CoinType, LoanTransactionsType, LoanType, OfferType } from 'core/types'
import { convertBaseToStandard } from '../exchange/services'
import { head } from 'ramda'

export const INVALID_COIN_TYPE = 'Invalid coin type'

export const NO_OFFER_EXISTS = 'NO_OFFER_EXISTS'
export const NO_LOAN_EXISTS = 'NO_LOAN_EXISTS'

export const getCollateralizationColor = (
  displayName: 'safe' | 'risky' | 'unsafe'
) => {
  switch (displayName) {
    case 'safe':
      return 'green600'
    case 'risky':
      return 'orange600'
    case 'unsafe':
      return 'red600'
  }
}

export const getCollateralAmtRequired = (loan: LoanType, offer: OfferType) => {
  return (
    (offer.terms.collateralRatio - loan.collateralisationRatio) *
    Number(
      convertBaseToStandard(
        loan.principal.amount[0].currency,
        loan.principal.amount[0].amount
      )
    )
  ).toFixed(2)
}

export const getCollateralizationDisplayName = (
  currentCollateral: number,
  offer: OfferType
) => {
  switch (true) {
    case currentCollateral <= offer.callTerms.liquidationHardRatio:
      return 'unsafe'
    case currentCollateral <= offer.callTerms.callTriggerRatio:
      return 'risky'
    default:
      return 'safe'
  }
}

export const fiatDisplayName = (coin: CoinType) => {
  switch (coin) {
    case 'PAX':
      return 'USD'
    default:
      return 'USD'
  }
}

export const lastTxFailed = (
  loan: LoanType,
  loanTransactions: Array<LoanTransactionsType>
): boolean => {
  const lastTx = head(loanTransactions)
  if (!lastTx) return false

  switch (loan.status) {
    case 'OPEN':
    case 'PENDING_EXECUTION':
    case 'PENDING_COLLATERAL_DEPOSIT':
      return lastTx.status === 'FAILED' && lastTx.type === 'DEPOSIT_COLLATERAL'
    case 'PENDING_CLOSE':
      return (
        lastTx.status === 'FAILED' &&
        lastTx.type === 'DEPOSIT_PRINCIPAL_AND_INTEREST'
      )
    default:
      return false
  }
}

export const showBorrowSummary = (loan: LoanType): boolean => {
  switch (loan.status) {
    case 'CLOSED':
    case 'FAILED':
      return false
    default:
      return true
  }
}

export const showCollateralizationStatus = (loan: LoanType): boolean => {
  switch (loan.status) {
    case 'CLOSED':
    case 'FAILED':
    case 'PENDING_EXECUTION':
    case 'PENDING_COLLATERAL_DEPOSIT':
      return false
    default:
      return true
  }
}
