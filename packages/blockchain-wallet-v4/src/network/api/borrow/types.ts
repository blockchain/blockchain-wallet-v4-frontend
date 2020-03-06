import { CoinType, NabuApiErrorType, RemoteDataType } from 'core/types'

export type MoneyType = {
  amount: string
  currency: CoinType
}

export type LoanFinancialsType = {
  collateralForInterest: Array<MoneyType>
  onCloseCollateralRefund: Array<MoneyType>
  onCloseCollateralTaken: Array<MoneyType>
  owedInterest: Array<MoneyType>
}

export type LoanTransactionsType = {
  notes: string
  principalTakenAsInterest: Array<MoneyType>
  request: {
    amount: MoneyType
    dstAddress: string
  }
  status: 'CONFIRMED' | 'REQUESTED' | 'UNCONFIRMED' | 'FAILED'
  type:
    | 'DEPOSIT_COLLATERAL'
    | 'WITHDRAW_PRINCIPAL'
    | 'TOPUP_COLLATERAL'
    | 'REFUND_COLLATERAL'
    | 'DEPOSIT_PRINCIPAL_AND_INTEREST'
    | 'WITHDRAW_COLLATERAL'
    | 'WITHDRAW_COLLATERAL_AND_CLOSE'
    | 'LIQUIDATED_PRINCIPAL'
    | 'LIQUIDATED_COLLATERAL'
    | 'LIQUIDATION_FEE'
    | 'INTEREST_TAKEN'
  value: {
    amount: MoneyType
    txHash?: string
  }
}

export type LoanType = {
  borrowerId: string
  collateral: {
    amounts: Array<MoneyType>
    depositAddresses: { [key in CoinType]: string }
    mark: MoneyType
    notional: MoneyType
  }
  collateralisationRatio: number
  expiration: Date
  financials?: LoanFinancialsType
  loanId: string
  offerId: string
  openedAt: string
  principal: {
    amount: Array<MoneyType>
    depositAddresses: { [key in CoinType]: string }
    mark: MoneyType
    notional: MoneyType
    withdrawAddresses: { [key in CoinType]: string }
  }
  status:
    | 'OPEN'
    | 'CLOSED'
    | 'PENDING_EXECUTION'
    | 'PENDING_COLLATERAL_DEPOSIT'
    | 'PENDING_PRINCIPAL_WITHDRAW'
    | 'PENDING_CLOSE'
    | 'ON_CALL'
    | 'LIQUIDATED'
    | 'FAILED'
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
