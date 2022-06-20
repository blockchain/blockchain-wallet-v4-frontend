import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { getBalanceSelector } from 'components/Balances/selectors'
import { RootState } from 'data/rootReducer'

export const useCoinBalances = () => {
  const state = useSelector((state: RootState) => state)
  const [coins, setCoins] = useState<Array<any> | null>(null)

  const allowedChains = ['ETH', 'BTC', 'XLM', 'BCH', 'STX']

  useEffect(() => {
    setTimeout(() => {
      if (window.coins) {
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
    }, 500)
  }, [window.coins])

  return coins
}
