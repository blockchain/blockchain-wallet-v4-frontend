import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { getBalanceSelector } from 'components/Balances/selectors'
import { RootState } from 'data/rootReducer'

import { CoinDataItem } from '.'

export const useSelfCustodyCoinsBalances = () => {
  const state = useSelector((state: RootState) => state)
  const [coins, setCoins] = useState<CoinDataItem[] | null>(null)

  const allowedChains = ['ETH', 'BTC', 'XLM', 'BCH', 'STX']

  useEffect(() => {
    const getCoins = () => {
      const coinsArr: CoinDataItem[] = []

      // TODO: Check active wallet
      Object.entries(window.coins).forEach(([coin, { coinfig }]: any) => {
        const balance = getBalanceSelector(coin)(state).getOrElse(0)
        if (
          (allowedChains.includes(coinfig.symbol) ||
            allowedChains.includes(coinfig.type.parentChain)) &&
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
