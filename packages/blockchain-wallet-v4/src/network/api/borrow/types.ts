import { CoinType } from '../../../types'

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
