import * as Conversion from './index'
import { bitcoinRates } from './conversion.textures'

describe('displayFiatToBitcoin', () => {
  it('should return correct value', () => {
    const input = {
      value: 1,
      fromCurrency: 'USD',
      toUnit: 'BTC',
      rates: bitcoinRates
    }
    const expectedOutput = 'BTC0.00015174'
    const result = Conversion.displayFiatToBitcoin(input)
    expect(result).toEqual(expectedOutput)
  })

  it('should return value 0 if value is undefined ', () => {
    const input = {
      fromCurrency: 'USD',
      toUnit: 'BTC',
      rates: bitcoinRates
    }
    const expectedOutput = 'BTC0'
    const result = Conversion.displayFiatToBitcoin(input)
    expect(result).toEqual(expectedOutput)
  })

  it('should return default if currency is undefined', () => {
    const input = {
      value: 1,
      toUnit: 'BTC',
      rates: bitcoinRates
    }
    const result = Conversion.convertFiatToBitcoin(input)
    expect(result).toEqual(Conversion.DefaultConversion)
  })

  it('should return default if currency does not exist', () => {
    const input = {
      value: 1,
      fromCurrency: 'USDDDD',
      toUnit: 'BTC',
      rates: bitcoinRates
    }
    const result = Conversion.convertFiatToBitcoin(input)
    expect(result).toEqual(Conversion.DefaultConversion)
  })

  it('should return default if unit is undefined', () => {
    const input = {
      value: 1,
      fromCurrency: 'USD',
      rates: bitcoinRates
    }
    const result = Conversion.convertFiatToBitcoin(input)
    expect(result).toEqual(Conversion.DefaultConversion)
  })

  it('should return default if unit does not exist', () => {
    const input = {
      value: 1,
      fromCurrency: 'USD',
      toUnit: 'BTCCCC',
      rates: bitcoinRates
    }
    const result = Conversion.convertFiatToBitcoin(input)
    expect(result).toEqual(Conversion.DefaultConversion)
  })

  // TODO: fix me
  // it('should return default if rates are undefined', () => {
  //   const input = {
  //     value: 1,
  //     fromCurrency: 'USD',
  //     toUnit: 'BTC',
  //     rates: {}
  //   }
  //   const result = Conversion.convertFiatToBitcoin(input)
  //   expect(result).toEqual(Conversion.DefaultConversion)
  // })
})
