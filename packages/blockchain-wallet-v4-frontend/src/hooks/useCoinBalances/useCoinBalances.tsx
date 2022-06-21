import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { getBalanceSelector } from 'components/Balances/selectors'
import { RootState } from 'data/rootReducer'

import { CoinDataItem } from '../../scenes/extension/CoinView/types'

export const useCoinBalances = () => {
  const state = useSelector((state: RootState) => state)
  const [coins, setCoins] = useState<CoinDataItem[] | null>(null)

  const allowedChains = ['ETH', 'BTC', 'XLM', 'BCH', 'STX']

  useEffect(() => {
    const getCoins = () => {
      const coinsArr: Array<any> = []
      Object.entries(window.coins).forEach((coin: any) => {
        const balance = getBalanceSelector(coin[0])(state).getOrElse(0).valueOf()
        const { coinfig } = coin[1]
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
    if (window.coins) {
      getCoins()
    } else {
      setTimeout(() => {
        getCoins()
      }, 500)
    }
  }, [window.coins])

  return coins
}
