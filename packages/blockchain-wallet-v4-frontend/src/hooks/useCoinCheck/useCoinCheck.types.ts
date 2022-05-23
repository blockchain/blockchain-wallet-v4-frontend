import { CoinType, Erc20CoinType, WalletFiatEnum, WalletFiatType } from '@core/types'

export type CoinCheckHookHelpers = {
  isBCH: (coin: CoinType) => boolean
  isBTC: (coin: CoinType) => boolean
  isCustodialCoin: (coin: CoinType) => boolean
  isETH: (coin: CoinType) => boolean
  isEUR: (coin: CoinType) => boolean
  isErc20Coin: (coin: CoinType) => coin is Erc20CoinType
  isFiatCoin: (coin: CoinType) => coin is WalletFiatType
  isGBP: (coin: CoinType) => boolean
  isUSD: (coin: CoinType) => boolean
  isXLM: (coin: CoinType) => boolean
}

export type CoinCheckHook = () => CoinCheckHookHelpers
