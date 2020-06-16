import { Exchange } from 'core'
import {
  fiatToString,
  formatFiat
} from 'blockchain-wallet-v4/src/exchange/currency'

export const calcCompoundInterest = (principal, rate, term) => {
  const COMPOUNDS_PER_YEAR = 365
  const principalInt = parseFloat(principal)
  if (!principalInt) return '0.00'
  const totalAmount =
    principalInt *
    Math.pow(1 + rate / (COMPOUNDS_PER_YEAR * 100), COMPOUNDS_PER_YEAR * term)
  return formatFiat(totalAmount - principalInt)
}

export const amountToFiat = (
  displayCoin,
  amount,
  coin,
  walletCurrency,
  rates
) =>
  displayCoin
    ? formatFiat(
        Exchange.convertCoinToFiat(amount, coin, walletCurrency, rates)
      )
    : formatFiat(amount)

export const amountToCrypto = (
  displayCoin,
  amount,
  coin,
  walletCurrency,
  rates
) => {
  if (displayCoin) {
    return amount
  } else {
    return Exchange.convertCoinToCoin({
      baseToStandard: true,
      coin,
      value: Exchange.convertFiatToBtc({
        fromCurrency: walletCurrency,
        toUnit: coin === 'BTC' ? 'SAT' : 'WEI',
        rates,
        value: amount
      }).value
    }).value
  }
}

export const maxFiat = (maxFiat, walletCurrency) =>
  fiatToString({
    value: maxFiat,
    unit: walletCurrency
  })
