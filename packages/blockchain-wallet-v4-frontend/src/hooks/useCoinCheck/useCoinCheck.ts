import { useMemo } from 'react'

import { CoinType, Erc20CoinType, WalletFiatType } from '@core/types'
import { selectors } from 'data'

import { CoinCheckHook, CoinCheckHookHelpers } from './useCoinCheck.types'

export const useCoinCheck: CoinCheckHook = () => {
  const isBTC: CoinCheckHookHelpers['isBTC'] = (coin) => coin === 'BTC'
  const isBCH: CoinCheckHookHelpers['isBCH'] = (coin) => coin === 'BCH'
  const isETH: CoinCheckHookHelpers['isETH'] = (coin) => coin === 'ETH'
  const isXLM: CoinCheckHookHelpers['isXLM'] = (coin) => coin === 'XLM'
  const isEUR: CoinCheckHookHelpers['isEUR'] = (coin) => coin === 'EUR'
  const isGBP: CoinCheckHookHelpers['isGBP'] = (coin) => coin === 'GBP'
  const isUSD: CoinCheckHookHelpers['isUSD'] = (coin) => coin === 'USD'

  const isErc20Coin: CoinCheckHookHelpers['isErc20Coin'] = (
    coin: CoinType
  ): coin is Erc20CoinType => selectors.core.data.coins.getErc20Coins().includes(coin)
  const isCustodialCoin: CoinCheckHookHelpers['isCustodialCoin'] = (coin) =>
    selectors.core.data.coins.getCustodialCoins().includes(coin)
  const isFiatCoin: CoinCheckHookHelpers['isFiatCoin'] = (coin: CoinType): coin is WalletFiatType =>
    isEUR(coin) || isGBP(coin) || isUSD(coin)

  return useMemo(
    () => ({
      isBCH,
      isBTC,
      isCustodialCoin,
      isETH,
      isEUR,
      isErc20Coin,
      isFiatCoin,
      isGBP,
      isUSD,
      isXLM
    }),
    []
  )
}
