import { CoinType } from 'core/types'

export type MoneyType = {
  symbol: CoinType
  value: string
}

export type LoanType = {
  borrowerId: string
  collateral: {
    amounts: Array<MoneyType>
    depositAddresses: { [key in CoinType]: string }
    mark: MoneyType
    notional: MoneyType
    withdrawAddress: { [key in CoinType]: string }
  }
  collateralisationRatio: number
  expiration: Date
  loanId: string
  offerId: string
  openedAt: Date
  principal: {
    amount: Array<MoneyType>
    depositAddresses: { [key in CoinType]: string }
    mark: MoneyType
    notional: MoneyType
    withdrawAddress: { [key in CoinType]: string }
  }
  status: 'PENDING_EXECUTION'
}

export type OfferType = {
  callTerms: {
    callTriggerRatio: number
    liquidationHardRatio: number
    marginTopupTime: number
    minutesBeforeLiquidation: number
  }
  id: string
  status: 'OPEN'
  terms: {
    collateralCcy: CoinType
    collateralRatio: number
    durationHours: number
    format: 'FLEX'
    interestRate: number
    maxYieldingAmount: {
      symbol: CoinType
      value: number
    }
    minPrincipalAmount: {
      symbol: CoinType
      value: number
    }
    principalCcy: CoinType
  }
}
