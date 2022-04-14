import { useMemo } from 'react'

import {
  getBchBalance,
  getBtcBalance,
  getCoinCustodialBalance,
  getErc20Balance,
  getEthBalance,
  getFiatBalance,
  getXlmBalance
} from 'components/Balances/selectors'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { useRemote } from '../useRemote'
import { CoinBalanceHook } from './useCoinBalance.types'

export const useCoinBalance: CoinBalanceHook = ({ coin }) => {
  const isErc20Coin = useMemo(
    () => selectors.core.data.coins.getErc20Coins().includes(coin),
    [coin]
  )
  const isCustodialCoin = useMemo(
    () => selectors.core.data.coins.getCustodialCoins().includes(coin),
    [coin]
  )
  const isEUR = coin === 'EUR'
  const isGBP = coin === 'GBP'
  const isUSD = coin === 'USD'
  const isBTC = coin === 'BTC'
  const isETH = coin === 'ETH'
  const isBCH = coin === 'BCH'
  const isXLM = coin === 'XLM'

  const isFiatCoin = isEUR || isGBP || isUSD

  return useRemote((state: RootState) => {
    if (isBTC) {
      return getBtcBalance(state)
    }

    if (isBCH) return getBchBalance(state)

    if (isETH) return getEthBalance(state)

    if (isXLM) return getXlmBalance(state)

    if (isFiatCoin) {
      return getFiatBalance(coin, state)
    }

    if (isErc20Coin) {
      return getErc20Balance(coin)(state)
    }

    if (isCustodialCoin) {
      return getCoinCustodialBalance(coin)(state)
    }

    throw Error(`Coin "${coin}" not supported by useCoinBalance`)
  })
}
