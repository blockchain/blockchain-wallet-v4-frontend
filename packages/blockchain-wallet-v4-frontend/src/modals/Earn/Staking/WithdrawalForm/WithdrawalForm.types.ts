import { CoinType, EarnBalanceType, EarnLimitsType, FiatType, RatesType } from '@core/types'
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

export type FormErrorsType = {
  amount?: 'ABOVE_MAX' | 'ABOVE_MAX_LIMIT' | 'BELOW_MIN' | boolean
}
