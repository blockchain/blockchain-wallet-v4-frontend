import {
  CoinType,
  LoanTransactionsStatusType,
  LoanTransactionsType,
  LoanType,
  OfferType
} from 'blockchain-wallet-v4/src/types'

import { convertBaseToStandard } from '../exchange/services'

export const NO_OFFER_EXISTS = 'NO_OFFER_EXISTS'
export const NO_LOAN_EXISTS = 'NO_LOAN_EXISTS'
export const USER_BLOCKED = 'User is from a blocked country or state'

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

export const isLastTxStatus = (
  statuses: Array<LoanTransactionsStatusType>,
  loan: LoanType,
  loanTransactions: Array<LoanTransactionsType>
): LoanTransactionsType | undefined => {
  let txType

  switch (loan.status) {
    case 'OPEN':
    case 'ON_CALL':
    case 'PENDING_EXECUTION':
    case 'PENDING_COLLATERAL_DEPOSIT':
      txType = 'DEPOSIT_COLLATERAL'
      break
    case 'PENDING_CLOSE':
      txType = 'DEPOSIT_PRINCIPAL_AND_INTEREST'
      break
    default:
      txType = undefined
  }

  if (!txType) return
  const lastDeposit = loanTransactions.find(tx => tx.type === txType)
  return lastDeposit && statuses.indexOf(lastDeposit.status) > -1
    ? lastDeposit
    : undefined
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
