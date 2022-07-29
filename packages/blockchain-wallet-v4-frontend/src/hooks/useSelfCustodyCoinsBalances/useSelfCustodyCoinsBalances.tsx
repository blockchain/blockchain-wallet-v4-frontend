import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { CoinDataItem } from '.'

export const useSelfCustodyCoinsBalances = () => {
  const state = useSelector((state: RootState) => state)
  const [coins, setCoins] = useState<CoinDataItem[] | null>(null)

  const selectedAccount = useSelector((state) => selectors.cache.getCache(state).selectedAccount)
  const activeAccountCoin = selectedAccount && selectedAccount[0].baseCoin

  useEffect(() => {
    const getCoins = () => {
      const coinsArr: CoinDataItem[] = []

      // TODO: Check active wallet
      Object.entries(window.coins).forEach(([coin, { coinfig }]: any) => {
        const balance = selectors.balances.getCoinTotalBalance(coin)(state).getOrElse(0)
        if (
          (activeAccountCoin === coinfig.symbol ||
            coinfig.type.parentChain === activeAccountCoin) &&
          balance > 0
        ) {
          coinsArr.push({ balance, coinfig })
        }
      })
      coinsArr.sort(function (a, b) {
        return a.balance + b.balance
      })
      setCoins(coinsArr)
    }
    getCoins()
  }, [window.coins])

  return coins
}
