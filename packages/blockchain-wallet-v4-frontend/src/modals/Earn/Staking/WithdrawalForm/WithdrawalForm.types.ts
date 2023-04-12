import {
  CoinType,
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

export type RemoteType = {
  coin: CoinType
  rates: RatesType
}
