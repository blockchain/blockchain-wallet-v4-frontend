import { Exchange } from 'blockchain-wallet-v4/src'

export const convertFiatToCoin = (value, data, coin) => {
  const { unit, currency, bitcoinRates, ethereumRates } = data.data

  const conversion = coin === 'BTC'
  ? Exchange.convertFiatToBitcoin({ value: value, fromCurrency: currency, toUnit: unit, rates: bitcoinRates })
  : Exchange.convertFiatToEther({ value: value, fromCurrency: currency, toUnit: unit, rates: ethereumRates })
  return { coin: conversion.value, fiat: value }
}

export const convertCoinToFiat = (value, data, coin) => {
  const { unit, currency, bitcoinRates, ethereumRates } = data.data

  const conversion = coin === 'BTC'
  ? Exchange.convertBitcoinToFiat({ value: value, fromUnit: unit, toCurrency: currency, rates: bitcoinRates })
  : Exchange.convertEtherToFiat({ value: value, fromUnit: unit, toCurrency: currency, rates: ethereumRates })

  return { coin: value, fiat: conversion.value }
}
