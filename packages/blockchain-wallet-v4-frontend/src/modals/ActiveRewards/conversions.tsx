import { Exchange } from '@core'
import { fiatToString } from '@core/exchange/utils'

export const amountToFiat = (displayCoin, amount, coin, walletCurrency, rates) =>
  displayCoin
    ? Exchange.convertCoinToFiat({
        coin,
        currency: walletCurrency,
        isStandard: true,
        rates,
        value: amount
      })
    : amount

export const maxFiat = (maxFiat, walletCurrency) =>
  fiatToString({
    unit: walletCurrency,
    value: maxFiat
  })
