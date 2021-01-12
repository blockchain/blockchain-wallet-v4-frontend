import { CoinType } from 'core/types'
import { SwapAccountType } from 'data/components/swap/types'

export enum RequestSteps {
  'COIN_SELECT',
  'SHOW_ADDRESS'
}

export type RequestFormType = {
  selectedAccount: SwapAccountType
  selectedCoin: CoinType | string
  step: RequestSteps
}
