import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toLower } from 'ramda'

import { WalletFiatType } from '@core/types'
import { actions, selectors } from 'data'

import { useCoinCheck } from '../useCoinCheck'
import { CoinTransactionsFetcherHook } from './useCoinTransactionsFetcher.types'

export const useCoinTransactionsFetcher: CoinTransactionsFetcherHook = (coin) => {
  const dispatch = useDispatch()
  const isDynamicSelfCustodyCoins = useSelector(() =>
    selectors.core.data.coins.getDynamicSelfCustodyCoins().includes(coin)
  )

  const { isCustodialCoin, isErc20Coin, isFiatCoin } = useCoinCheck()

  useEffect(() => {
    if (isErc20Coin(coin)) {
      dispatch(actions.components.ethTransactions.initializedErc20(coin))

      return
    }

    if (isCustodialCoin(coin) || isDynamicSelfCustodyCoins) {
      dispatch(actions.components.coinTransactions.initialized(coin))
      return
    }

    if (isFiatCoin(coin)) {
      dispatch(actions.components.fiatTransactions.initialized(coin as WalletFiatType))
      return
    }

    dispatch(actions.components[`${toLower(coin)}Transactions`].initialized())
  }, [coin, isErc20Coin, dispatch, isDynamicSelfCustodyCoins, isCustodialCoin, isFiatCoin])
}
