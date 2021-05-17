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
  coinfig: {
    name: string,
    precision: number,
    products: string[],
    symbol: string,
    type: {
      erc20Address?: string,
      logoPngUrl: string,
      name: string,
      parentChain: string,
      websiteUrl: string
    }
  },
  config: {
    network: string
  },
  contractAddress?: string,
  displayName: string,
  hasLockboxSupport: boolean,
  invited?: boolean,
  isFiat?: boolean,
  learnMoreLink: string,
  method?: boolean,
  minConfirmations: number,
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
  contractAddress?: never
  displayName: string
  invited?: boolean
  isFiat?: boolean
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
