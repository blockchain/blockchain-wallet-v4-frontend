import * as WalletOptions from '../../../../../config/mocks/wallet-options-v4.json'
import { CoinType, RemoteDataType, WalletFiatType } from '../../types'

export type WalletOptionsType = typeof WalletOptions

type Category = {
  description: string
  id: string
  name: string
}

export type CoinfigType = {
  categories: Category[]
  displaySymbol: string
  name: string
  precision: number
  products: ('CustodialWalletBalance' | 'PrivateKey' | 'DynamicSelfCustody')[]
  symbol: string
  type: {
    erc20Address?: string
    isMemoBased?: string
    logoPngUrl: string
    minimumOnChainConfirmations?: number
    name: 'FIAT' | 'ERC20' | 'COIN'
    parentChain?: string
    websiteUrl: string
  }
}

export type SupportedCoinType = {
  availability: {
    exchangeFrom: boolean
    exchangeTo: boolean
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

export type SupportedWalletCurrencyType = SupportedCoinType | SupportedFiatType

// state
export type WalletOptionsState = RemoteDataType<string, WalletOptionsType>
export type WalletOptionsStateType = {
  details: RemoteDataType<string, WalletOptionsType>
}
