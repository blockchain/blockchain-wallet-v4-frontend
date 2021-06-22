import * as WalletOptions from '../../../../../config/mocks/wallet-options-v4.json'
import { CoinType, RemoteDataType, WalletFiatType } from '../../types'

export type WalletOptionsType = typeof WalletOptions

export type SupportedCoinType = {
  availability: {
    exchangeFrom: boolean
    exchangeTo: boolean
    lockbox: boolean
    request: boolean
    send: boolean
    syncToPit: boolean
  }
  coinCode: CoinType
  coinTicker: CoinType
  config: {
    network: string
  }
  contractAddress?: string
  displayName: string
  hasLockboxSupport: boolean
  invited?: boolean
  isMemoBased?: boolean
  learnMoreLink: string
  method?: boolean
  minConfirmations: number
  txExplorerBaseUrl: string
  txListAppRoute: string
}

export type SupportedFiatType = {
  availability: {
    deposit: boolean
    request: false
    send: false
    withdrawal: boolean
  }
  coinCode: WalletFiatType
  coinTicker: WalletFiatType
  displayName: 'Euros' | 'Pounds'
  invited?: boolean
  learnMoreLink: ''
  method?: boolean
  minConfirmations: 0
  txExplorerBaseUrl: ''
  txListAppRoute: string
}

export type SupportedWalletCurrenciesType = {
  [key in CoinType]: SupportedCoinType
} &
  {
    [key in WalletFiatType]: SupportedFiatType
  }

export type SupportedWalletCurrencyType = SupportedCoinType | SupportedFiatType

// state
export type WalletOptionsState = RemoteDataType<string, WalletOptionsType>
