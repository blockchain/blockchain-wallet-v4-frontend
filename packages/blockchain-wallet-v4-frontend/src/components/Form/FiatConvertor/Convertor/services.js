import { Exchange } from 'blockchain-wallet-v4/src'

export const convertFiatToCoin = (
  value,
  unit,
  currency,
  bchRates,
  btcRates,
  bsvRates,
  ethRates,
  xlmRates
) => {
  switch (unit) {
    case 'BTC':
      return {
        coin: Exchange.convertFiatToBitcoin({
          value,
          fromCurrency: currency,
          toUnit: unit,
          rates: btcRates
        }).value,
        fiat: value
      }
    case 'ETH':
      return {
        coin: Exchange.convertFiatToEther({
          value,
          fromCurrency: currency,
          toUnit: unit,
          rates: ethRates
        }).value,
        fiat: value
      }
    case 'BCH':
      return {
        coin: Exchange.convertFiatToBch({
          value,
          fromCurrency: currency,
          toUnit: unit,
          rates: bchRates
        }).value,
        fiat: value
      }
    case 'BSV':
      return {
        coin: Exchange.convertFiatToBsv({
          value,
          fromCurrency: currency,
          toUnit: unit,
          rates: bsvRates
        }).value,
        fiat: value
      }
    case 'XLM':
      return {
        coin: Exchange.convertFiatToXlm({
          value,
          fromCurrency: currency,
          toUnit: unit,
          rates: xlmRates
        }).value,
        fiat: value
      }
  }
}

export const convertCoinToFiat = (
  value,
  unit,
  currency,
  bchRates,
  btcRates,
  bsvRates,
  ethRates,
  xlmRates
) => {
  switch (unit) {
    case 'BTC':
      return {
        coin: value,
        fiat: Exchange.convertBitcoinToFiat({
          value,
          fromUnit: unit,
          toCurrency: currency,
          rates: btcRates
        }).value
      }
    case 'ETH':
      return {
        coin: value,
        fiat: Exchange.convertEtherToFiat({
          value,
          fromUnit: unit,
          toCurrency: currency,
          rates: ethRates
        }).value
      }
    case 'BCH':
      return {
        coin: value,
        fiat: Exchange.convertBchToFiat({
          value,
          fromUnit: unit,
          toCurrency: currency,
          rates: bchRates
        }).value
      }
    case 'BSV':
      return {
        coin: value,
        fiat: Exchange.convertBsvToFiat({
          value,
          fromUnit: unit,
          toCurrency: currency,
          rates: bsvRates
        }).value
      }
    case 'XLM':
      return {
        coin: value,
        fiat: Exchange.convertXlmToFiat({
          value,
          fromUnit: unit,
          toCurrency: currency,
          rates: xlmRates
        }).value
      }
  }
}
