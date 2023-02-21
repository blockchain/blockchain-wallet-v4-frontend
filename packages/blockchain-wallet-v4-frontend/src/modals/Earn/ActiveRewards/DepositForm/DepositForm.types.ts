import {
  CoinType,
  EarnDepositErrorsType,
  EarnEDDStatus,
  EarnRatesType,
  FiatType,
  PaymentValue,
  RatesType
} from '@core/types'
import { ActiveRewardsDepositFormType, EarnMinMaxType } from 'data/types'

export type PropsType = {
  coin: CoinType
}

export type DataType = {
  displayCoin: boolean
  earnDepositLimits: EarnMinMaxType
  formErrors: EarnDepositErrorsType
  prefillAmount?: number
  underSanctionsMessage: string | null
  values: ActiveRewardsDepositFormType
  walletCurrency: FiatType
}

export type RemoteType = {
  activeRewardsRates: EarnRatesType['rates']
  depositFee: number
  earnEDDStatus: EarnEDDStatus
  isActiveRewardsWithdrawalEnabled: boolean
  payment?: PaymentValue
  rates: RatesType
}

export type SuccessPropsType = {
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
  isActiveRewardsWithdrawalEnabled: boolean
  isCustodial: boolean
  isEDDRequired: boolean
  isErc20: boolean
  maxDepositFiat: string
  rates: RatesType
  submitting?: boolean
  walletCurrency: FiatType
}
