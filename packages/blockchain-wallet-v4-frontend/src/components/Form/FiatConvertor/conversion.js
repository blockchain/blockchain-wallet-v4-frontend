import { Exchange } from 'blockchain-wallet-v4/src'

export const convertFiatToCoin = (value, data, coin) => {
  const { unit, currency, bchRates, bitcoinRates, ethereumRates } = data.data

  const conversion =
    coin === 'BTC' ? Exchange.convertFiatToBitcoin({ value: value, fromCurrency: currency, toUnit: unit, rates: bitcoinRates })
      : coin === 'ETH' ? Exchange.convertFiatToEther({ value: value, fromUnit: currency, toCurrency: unit, rates: ethereumRates })
        : Exchange.convertFiatToBch({ value: value, fromUnit: currency, toCurrency: unit, rates: bchRates })

  return { coin: conversion.value, fiat: value }
}

export const convertCoinToFiat = (value, data, coin) => {
  const { unit, currency, bchRates, bitcoinRates, ethereumRates } = data.data

  const conversion =
    coin === 'BTC' ? Exchange.convertBitcoinToFiat({ value: value, fromUnit: unit, toCurrency: currency, rates: bitcoinRates })
      : coin === 'ETH' ? Exchange.convertEtherToFiat({ value: value, fromUnit: unit, toCurrency: currency, rates: ethereumRates })
        : Exchange.convertBchToFiat({ value: value, fromUnit: unit, toCurrency: currency, rates: bchRates })
  return { coin: value, fiat: conversion.value }
}
