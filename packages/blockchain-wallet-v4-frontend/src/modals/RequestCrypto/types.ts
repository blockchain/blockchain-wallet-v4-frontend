import { CoinType, WalletCurrencyType } from '@core/types'
import { SwapAccountType } from 'data/components/swap/types'

export enum RequestSteps {
  'COIN_SELECT',
  'IDV_INTRO',
  'SHOW_ADDRESS'
}

export type RequestFormType = {
  coinSearch: string
  currencyDisplay: WalletCurrencyType
  selectedAccount: SwapAccountType
  selectedCoin: CoinType | string
  step: RequestSteps
}
