import { lift } from 'ramda'

import { convertCoinToFiat } from '@core/exchange'
import { ExtractSuccess, RatesType } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [selectors.balancesV2.getUnifiedBalances, selectors.core.settings.getCurrency],
  (unifiedBalancesR, currencyR) => {
    const transform = (unifiedBalances: ExtractSuccess<typeof unifiedBalancesR>, currency) => {
      const ethBalance = unifiedBalances.find(({ ticker }) => ticker === 'ETH')
      const ethBalanceAmt = ethBalance?.amount.amount || 0
      const ethRates: RatesType = { price: ethBalance?.price || 0, timestamp: 0, volume24h: 0 }
      let total = Number(
        convertCoinToFiat({ coin: 'ETH', currency, rates: ethRates, value: ethBalanceAmt })
      )
      const erc20Balances = unifiedBalances
        .filter((balance) => {
          return !!window.coins[balance.ticker]
        })
        .filter((balance) => !!window.coins[balance.ticker].coinfig.type.erc20Address)

      erc20Balances.forEach((erc20Balance) => {
        const value = erc20Balance.amount.amount
        const rates: RatesType = { price: erc20Balance.price, timestamp: 0, volume24h: 0 }
        total += Number(convertCoinToFiat({ coin: erc20Balance.ticker, currency, rates, value }))
      })

      return {
        currency,
        erc20Balances,
        ethBalance,
        total
      }
    }

    return lift(transform)(unifiedBalancesR, currencyR)
  }
)
