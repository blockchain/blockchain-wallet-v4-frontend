import { Exchange } from 'blockchain-wallet-v4/src'
import {
  fiatToString,
  formatFiat
} from 'blockchain-wallet-v4/src/exchange/currency'

const PERCENTAGE_100 = 100

export const calcCompoundInterest = (principal, rate, term) => {
  const COMPOUNDS_PER_YEAR = 365
  const principalInt = parseFloat(principal)
  if (!principalInt) return '0.00'
  const totalAmount =
    principalInt *
    Math.pow(
      1 + rate / (COMPOUNDS_PER_YEAR * PERCENTAGE_100),
      COMPOUNDS_PER_YEAR * term
    )
  return formatFiat(totalAmount - principalInt)
}

export const calcBasicInterest = (principal: number, rate: number): number =>
  principal * (1 + rate / PERCENTAGE_100)

export const amountConverter = (amount, coin) => {
  return Exchange.convertCoinToCoin({
    value: amount || 0,
    coin,
    baseToStandard: true
  }).value
}

export const amountToFiat = (
  displayCoin,
  amount,
  coin,
  walletCurrency,
  rates
) =>
  displayCoin
    ? Exchange.convertCoinToFiat(amount, coin, walletCurrency, rates)
    : amount

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
