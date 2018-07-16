import { Exchange } from 'blockchain-wallet-v4/src'

export const convertFiatToCoin = (value, unit, currency, bchRates, btcRates, ethRates) => {
  switch (unit) {
    case 'BTC': return { coin: Exchange.convertFiatToBitcoin({ value, fromCurrency: currency, toUnit: unit, rates: btcRates }).value, fiat: value }
    case 'ETH': return { coin: Exchange.convertFiatToEther({ value, fromCurrency: currency, toUnit: unit, rates: ethRates }).value, fiat: value }
    case 'BCH': return { coin: Exchange.convertFiatToBch({ value, fromCurrency: currency, toUnit: unit, rates: bchRates }).value, fiat: value }
  }
}

export const convertCoinToFiat = (value, unit, currency, bchRates, btcRates, ethRates) => {
  switch (unit) {
    case 'BTC': return { coin: value, fiat: Exchange.convertBitcoinToFiat({ value, fromUnit: unit, toCurrency: currency, rates: btcRates }).value }
    case 'ETH': return { coin: value, fiat: Exchange.convertEtherToFiat({ value, fromUnit: unit, toCurrency: currency, rates: ethRates }).value }
    case 'BCH': return { coin: value, fiat: Exchange.convertBchToFiat({ value, fromUnit: unit, toCurrency: currency, rates: bchRates }).value }
  }
}
