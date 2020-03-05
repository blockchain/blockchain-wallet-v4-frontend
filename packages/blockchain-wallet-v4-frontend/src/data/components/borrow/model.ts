import { CoinType, LoanType, OfferType } from 'core/types'

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
    Number(loan.principal.amount[0].amount)
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
