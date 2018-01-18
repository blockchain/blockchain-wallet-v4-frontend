import { equals } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'

export const convertCoin1 = (value, fromCoin, toCoin, data) => data.map(x => {
  let coin2, fiat1, fiat2
  if (equals(fromCoin, 'BTC') && equals(toCoin, 'ETH')) {
    fiat1 = Exchange.convertBitcoinToFiat({ value: value, fromUnit: x.btcUnit, toCurrency: x.currency, rates: x.bitcoinRates })
    coin2 = Exchange.convertBitcoinToEther({ value: value, fromUnit: x.btcUnit, toUnit: x.ethUnit, rate: x.btcEth.rate, reverse: false })
    fiat2 = Exchange.convertEtherToFiat({ value: coin2.value, fromUnit: x.ethUnit, toCurrency: x.currency, rates: x.ethereumRates })
  }
  if (equals(fromCoin, 'ETH') && equals(toCoin, 'BTC')) {
    fiat1 = Exchange.convertEtherToFiat({ value: value, fromUnit: x.ethUnit, toCurrency: x.currency, rates: x.ethereumRates })
    coin2 = Exchange.convertEtherToBitcoin({ value: value, fromUnit: x.ethUnit, toUnit: x.btcUnit, rate: x.ethBtc.rate, reverse: false })
    fiat2 = Exchange.convertBitcoinToFiat({ value: coin2.value, fromUnit: x.btcUnit, toCurrency: x.currency, rates: x.bitcoinRates })
  }
  return { coin1: value, coin2: coin2.value, fiat1: fiat1.value, fiat2: fiat2.value }
})

export const convertCoin2 = (value, fromCoin, toCoin, data) => data.map(x => {
  let coin1, fiat1, fiat2
  if (equals(fromCoin, 'BTC') && equals(toCoin, 'ETH')) {
    fiat2 = Exchange.convertEtherToFiat({ value: value, fromUnit: x.ethUnit, toCurrency: x.currency, rates: x.ethereumRates })
    coin1 = Exchange.convertEtherToBitcoin({ value: value, fromUnit: x.ethUnit, toUnit: x.btcUnit, rate: x.btcEth.rate, reverse: true })
    fiat1 = Exchange.convertBitcoinToFiat({ value: coin1.value, fromUnit: x.btcUnit, toCurrency: x.currency, rates: x.bitcoinRates })
  }
  if (equals(fromCoin, 'ETH') && equals(toCoin, 'BTC')) {
    fiat2 = Exchange.convertBitcoinToFiat({ value: value, fromUnit: x.btcUnit, toCurrency: x.currency, rates: x.bitcoinRates })
    coin1 = Exchange.convertBitcoinToEther({ value: value, fromUnit: x.btcUnit, toUnit: x.ethUnit, rate: x.ethBtc.rate, reverse: true })
    fiat1 = Exchange.convertEtherToFiat({ value: coin1.value, fromUnit: x.ethUnit, toCurrency: x.currency, rates: x.ethereumRates })
  }
  return { coin1: coin1.value, coin2: value, fiat1: fiat1.value, fiat2: fiat2.value }
})

export const convertFiat1 = (value, fromCoin, toCoin, data) => data.map(x => {
  let coin1, coin2, fiat2
  if (equals(fromCoin, 'BTC') && equals(toCoin, 'ETH')) {
    coin1 = Exchange.convertFiatToBitcoin({ value: value, fromCurrency: x.currency, toUnit: x.btcUnit, rates: x.bitcoinRates })
    coin2 = Exchange.convertBitcoinToEther({ value: coin1.value, fromUnit: x.btcUnit, toUnit: x.ethUnit, rate: x.btcEth.rate, reverse: false })
    fiat2 = Exchange.convertEtherToFiat({ value: coin2.value, fromUnit: x.ethUnit, toCurrency: x.currency, rates: x.ethereumRates })
  }
  if (equals(fromCoin, 'ETH') && equals(toCoin, 'BTC')) {
    coin1 = Exchange.convertFiatToEther({ value: value, fromCurrency: x.currency, toUnit: x.ethUnit, rates: x.ethereumRates })
    coin2 = Exchange.convertEtherToBitcoin({ value: coin1.value, fromUnit: x.ethUnit, toUnit: x.btcUnit, rate: x.ethBtc.rate, reverse: false })
    fiat2 = Exchange.convertEtherToFiat({ value: coin2.value, fromUnit: x.ethUnit, toCurrency: x.currency, rates: x.ethereumRates })
  }
  return { coin1: coin1.value, coin2: coin2.value, fiat1: value, fiat2: fiat2.value }
})

export const convertFiat2 = (value, fromCoin, toCoin, data) => data.map(x => {
  let coin1, fiat1, coin2
  if (equals(fromCoin, 'BTC') && equals(toCoin, 'ETH')) {
    coin2 = Exchange.convertFiatToEther({ value: value, fromCurrency: x.currency, toUnit: x.ethUnit, rates: x.ethereumRates })
    coin1 = Exchange.convertEtherToBitcoin({ value: coin2.value, fromUnit: x.ethUnit, toUnit: x.btcUnit, rate: x.btcEth.rate, reverse: true })
    fiat1 = Exchange.convertBitcoinToFiat({ value: coin1.value, fromUnit: x.btcUnit, toCurrency: x.currency, rates: x.bitcoinRates })
  }
  if (equals(fromCoin, 'ETH') && equals(toCoin, 'BTC')) {
    coin2 = Exchange.convertFiatToBitcoin({ value: value, fromCurrency: x.currency, toUnit: x.btcUnit, rates: x.bitcoinRates })
    coin1 = Exchange.convertBitcoinToEther({ value: coin2.value, fromUnit: x.btcUnit, toUnit: x.ethUnit, rate: x.ethBtc.rate, reverse: true })
    fiat1 = Exchange.convertEtherToFiat({ value: coin1.value, fromUnit: x.ethUnit, toCurrency: x.currency, rates: x.ethereumRates })
  }
  return { coin1: coin1.value, coin2: coin2.value, fiat1: fiat1.value, fiat2: value }
})
