import * as WalletOptions from '../../../../../config/mocks/wallet-options-v4.json'
import { CoinType, FiatType } from '../../types'
import { IcoMoonType } from 'blockchain-info-components/src/Icons/Icomoon'

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
  colorCode: 'btc' | 'bch' | 'eth' | 'xlm' | 'pax' | 'stx' | 'usdt'
  config: {
    network: string
  }
  contractAddress?: string
  displayName: string
  hasLockboxSupport: boolean
  icons: {
    circle: keyof IcoMoonType
    circleFilled: keyof IcoMoonType
    default: keyof IcoMoonType
  }
  invited?: boolean
  learnMoreLink: string
  method?: boolean
  minConfirmations: number
  showNewTagSidenav: boolean
  txExplorerBaseUrl: string
  txListAppRoute: string
}

export type SupportedFiatType = {
  availability: {}
  coinCode: FiatType
  coinTicker: FiatType
  colorCode: 'fiat'
  displayName: 'Euro' | 'British Pounds'
  icons: {
    circle: 'eur' | 'gbp'
    circleFilled: 'eur' | 'gbp'
    default: 'eur' | 'gbp'
  }
  invited?: boolean
  learnMoreLink: ''
  method?: boolean
  minConfirmations: 0
  txExplorerBaseUrl: ''
  txListAppRoute: string
}

export type SupportedCoinsType = {
  [key in CoinType]: SupportedCoinType
} &
  {
    [key in FiatType]: SupportedFiatType
  }
