import {
  BSBalancesType,
  CoinType,
  EarnAccountBalanceResponseType,
  EarnBalanceType,
  EarnDepositErrorsType,
  EarnEDDStatus,
  EarnLimitsType,
  EarnRatesType,
  FiatType,
  PaymentValue,
  RatesType
} from '@core/types'
import { StakingWithdrawalFormType } from 'data/types'

export type DataType = {
  displayCoin: boolean
  prefillAmount?: number
  values: StakingWithdrawalFormType
  walletCurrency: FiatType
}

export type PropsType = {
  coin: CoinType
}

export type RemotePropsType = {
  accountBalance: EarnBalanceType
  buySellBalance: string
  rates: RatesType
  stakingLimits: EarnLimitsType
}
