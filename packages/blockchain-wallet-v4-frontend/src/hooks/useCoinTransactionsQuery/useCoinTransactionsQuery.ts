import { useCallback } from 'react'
import { DefaultRootState } from 'react-redux'
import { TxType } from 'blockchain-wallet-v4-frontend/src/scenes/Transactions/types'
import { toLower } from 'ramda'

import { CoinType } from '@core/types'
import { selectors } from 'data'

import { useCoinCheck } from '../useCoinCheck'
import { RemoteHookSelector, useRemote } from '../useRemote'
import { CoinTransactionsQueryHook } from './useCoinTransactionsQuery.types'

const useCoinTransactionsQuery: CoinTransactionsQueryHook = ({ coin }) => {
  const { isCustodialCoin, isErc20Coin } = useCoinCheck()

  const getSelectorForCoin = useCallback(
    (coin: CoinType): RemoteHookSelector<any, TxType[], DefaultRootState> => {
      if (isErc20Coin(coin)) {
        return (state) => selectors.core.common.eth.getErc20WalletTransactions(state, coin)
      }

      if (isCustodialCoin(coin)) {
        // return (state) => selectors.core.common.coins.getWalletTransactions(state, coin)
      }

      const commonCoinSelector = selectors.core.common[toLower(coin)]

      if (commonCoinSelector) {
        return commonCoinSelector.getWalletTransactions
      }

      throw Error()

      // default to fiat
      // return (state) => selectors.core.data.fiat.getTransactions(coin, state)
    },
    [isErc20Coin]
  )

  return useRemote<{ message: string }, TxType[]>(getSelectorForCoin(coin))
}

export default useCoinTransactionsQuery
