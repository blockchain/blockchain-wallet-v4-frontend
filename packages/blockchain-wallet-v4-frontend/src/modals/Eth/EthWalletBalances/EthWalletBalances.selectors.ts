import { lift } from 'ramda'

import { createDeepEqualSelector } from '@core/utils'
import { getEthBalance } from 'components/Balances/nonCustodial/selectors'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [getEthBalance, selectors.core.data.eth.getErc20AccountTokenBalances],
  (ethBalanceR, erc20BalancesR) => {
    const transform = (ethBalance, erc20Balances) => {
      const total = 0
      console.log(erc20Balances)
      erc20Balances.map((acc, curr) => {
        const transform2 = (rates) => {
          if (!rates.price) return 0
          //   return convertCoinToFiat({ coin, currency, rates, value: balance })
        }

        // const ratesR = selectors.core.data.coins.getRates(coin, state)
        // return lift(transform2)(ratesR)
      }, [])

      return {
        erc20Balances,
        ethBalance,
        total
      }
    }

    return lift(transform)(ethBalanceR, erc20BalancesR)
  }
)
