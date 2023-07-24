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
import { EarnMinMaxType, RewardsDepositFormType } from 'data/types'

export type PropsType = {
  coin: CoinType
}

export type DataType = {
  displayCoin: boolean
  earnDepositLimits: EarnMinMaxType
  formErrors: EarnDepositErrorsType
  prefillAmount?: number
  underSanctionsMessage: string | null
  values: RewardsDepositFormType
  walletCurrency: FiatType
}

export type RemoteType = {
  depositFee: number
  earnEDDStatus: EarnEDDStatus
  payment?: PaymentValue
  rates: RatesType
  stakingLimits: EarnLimitsType
  stakingRates: EarnRatesType['rates']
}

export type SuccessPropsType = {
  bondingDays: number
  coin: CoinType
  currencySymbol: string
  depositAmountError: false | 'ABOVE_MAX' | 'BELOW_MIN' | undefined
  depositFee: number
  displayCoin: boolean
  displaySymbol: string
  earnDepositLimits: EarnMinMaxType
  handleAmountChanged: (e) => void
  handleChangeDepositAmount: () => void
  handleDisplayToggle: (isCoin: boolean) => void
  handleFormSubmit: () => void
  handleMaxAmountClicked: () => void
  handleMinAmountClicked: () => void
  insufficientEth?: boolean
  invalid?: boolean
  isCustodial: boolean
  isEDDRequired: boolean
  isErc20: boolean
  maxDepositFiat: string
  rates: RatesType
  submitting?: boolean
  walletCurrency: FiatType
}
