import { CoinType, WalletCurrencyType } from 'blockchain-wallet-v4/src/types'
import { SwapAccountType } from 'data/components/swap/types'

export enum RequestSteps {
  'COIN_SELECT',
  'SHOW_ADDRESS',
  'BUILD_LINK',
  'SHARE_LINK'
}

export type RequestFormType = {
  currencyDisplay: WalletCurrencyType
  requestAmount: number | string
  requestDescription: string
  selectedAccount: SwapAccountType
  selectedCoin: CoinType | string
  step: RequestSteps
}
