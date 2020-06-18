import { convertBaseToStandard } from 'data/components/exchange/services'
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

export const amountConverter = (amount, coin) =>
  Exchange.convertCoinToCoin({
    value: amount || 0,
    coin,
    baseToStandard: true
  }).value

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
    return Exchange.convertFiatToCoin(amount, coin, walletCurrency, rates)
  }
}

export const maxFiat = (maxFiat, walletCurrency) =>
  fiatToString({
    value: maxFiat,
    unit: walletCurrency
  })

export const availToWithdrawFiatConverter = (
  amount,
  coin,
  walletCurrency,
  rates
) => {
  return Exchange.convertCoinToFiat(
    convertBaseToStandard(amount, coin),
    coin,
    walletCurrency,
    rates
  )
}
