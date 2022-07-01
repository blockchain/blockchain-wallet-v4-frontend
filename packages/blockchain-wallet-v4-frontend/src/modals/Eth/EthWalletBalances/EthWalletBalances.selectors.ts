import { lift } from 'ramda'

import { convertCoinToFiat } from '@core/exchange'
import { AccountTokensBalancesResponseType } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = createDeepEqualSelector(
  [
    selectors.balances.getCoinNonCustodialBalance('ETH'),
    selectors.core.settings.getCurrency,
    selectors.core.data.eth.getErc20AccountTokenBalances,
    // @ts-ignore
    (state) => selectors.core.data.coins.getRates('ETH', state),
    (state) => state
  ],
  (ethBalanceR, currencyR, erc20BalancesR, ethRatesR, state: RootState) => {
    const transform = (
      ethBalance,
      currency,
      ethRates,
      erc20Balances: AccountTokensBalancesResponseType['tokenAccounts']
    ) => {
      let total = Number(
        convertCoinToFiat({ coin: 'ETH', currency, rates: ethRates, value: ethBalance })
      )
      erc20Balances
        .filter((curr) => !!window.coins[curr.tokenSymbol])
        .map((curr) => {
          const symbol = Object.keys(window.coins).find(
            (coin) =>
              window.coins[coin].coinfig.type?.erc20Address?.toLowerCase() ===
              curr.tokenHash.toLowerCase()
          )
          if (!symbol) return

          const transform2 = (rates) => {
            if (!rates.price) return 0

            total += Number(
              convertCoinToFiat({ coin: symbol, currency, rates, value: curr.balance })
            )
          }

          const ratesR = selectors.core.data.coins.getRates(symbol, state)
          return lift(transform2)(ratesR)
        })

      return {
        currency,
        erc20Balances,
        ethBalance,
        total
      }
    }

    return lift(transform)(ethBalanceR, currencyR, ethRatesR, erc20BalancesR)
  }
)
