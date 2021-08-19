import * as WalletOptions from '../../../../../config/mocks/wallet-options-v4.json'
import { CoinType, RemoteDataType, WalletFiatType } from '../../types'

export type WalletOptionsType = typeof WalletOptions

export type CoinfigType = {
  name: string
  precision: number
  products: string[]
  symbol: string
  type: {
    erc20Address?: string
    isFiat?: boolean
    logoPngUrl: string
    name: string
    parentChain: string
    websiteUrl: string
  }
}

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
  coinfig: CoinfigType
  config: {
    network: string
  }
  contractAddress?: string
  displayName: string
  hasLockboxSupport: boolean
  invited?: boolean
  isFiat?: boolean
  isMemoBased?: boolean
  learnMoreLink: string
  method?: boolean
  minConfirmations: number
  txExplorerBaseUrl: string
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
  coinfig: CoinfigType
  contractAddress?: never
  displayName: string
  invited?: boolean
  isFiat?: boolean
  learnMoreLink: ''
  method?: boolean
  minConfirmations: 0
  txExploreBaseUrl: ''
}

export type SupportedWalletCurrenciesType = {
  [key in CoinType]: SupportedCoinType
} &
  {
    [key in WalletFiatType]: SupportedFiatType
  } &
  {
    [key in string]: SupportedCoinType
  }

export type SupportedWalletCurrencyType = SupportedCoinType | SupportedFiatType

// state
export type WalletOptionsState = RemoteDataType<string, WalletOptionsType>
