import { Exchange } from '@core'
import { fiatToString } from '@core/exchange/utils'

export const amountToCrypto = ({ amount, coin }) =>
  Exchange.convertCoinToCoin({
    coin,
    value: amount
  })

export const amountToFiat = ({ amount, coin, rates, walletCurrency }) => {
  const value = amountToCrypto({ amount, coin })

  return Exchange.displayCoinToFiat({
    rates,
    toCurrency: walletCurrency,
    value
  })
}

export const maxFiat = (maxFiat, walletCurrency) =>
  fiatToString({
    unit: walletCurrency,
    value: maxFiat
  })
