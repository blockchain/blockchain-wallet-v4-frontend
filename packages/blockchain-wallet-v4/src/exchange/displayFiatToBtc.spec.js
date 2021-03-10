import { btcRates } from './conversion.textures'
import * as Conversion from './index'

describe('displayFiatToBtc', () => {
  it('should return correct value', () => {
    const input = {
      value: 1,
      fromCurrency: 'USD',
      toUnit: 'BTC',
      rates: btcRates
    }
    const expectedOutput = '0.00015174 BTC'
    const result = Conversion.displayFiatToBtc(input)
    expect(result).toEqual(expectedOutput)
  })

  it('should return value 0 if value is undefined ', () => {
    const input = {
      fromCurrency: 'USD',
      toUnit: 'BTC',
      rates: btcRates
    }
    const expectedOutput = '0 BTC'
    const result = Conversion.displayFiatToBtc(input)
    expect(result).toEqual(expectedOutput)
  })

  it('should return default if currency is undefined', () => {
    const input = {
      value: 1,
      toUnit: 'BTC',
      rates: btcRates
    }
    const result = Conversion.convertFiatToBtc(input)
    expect(result).toEqual(Conversion.DefaultConversion)
  })

  it('should return default if currency does not exist', () => {
    const input = {
      value: 1,
      fromCurrency: 'USDDDD',
      toUnit: 'BTC',
      rates: btcRates
    }
    const result = Conversion.convertFiatToBtc(input)
    expect(result).toEqual(Conversion.DefaultConversion)
  })

  it('should return default if unit is undefined', () => {
    const input = {
      value: 1,
      fromCurrency: 'USD',
      rates: btcRates
    }
    const result = Conversion.convertFiatToBtc(input)
    expect(result).toEqual(Conversion.DefaultConversion)
  })

  it('should return default if unit does not exist', () => {
    const input = {
      value: 1,
      fromCurrency: 'USD',
      toUnit: 'BTCCCC',
      rates: btcRates
    }
    const result = Conversion.convertFiatToBtc(input)
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
  //   const result = Conversion.convertFiatToBtc(input)
  //   expect(result).toEqual(Conversion.DefaultConversion)
  // })
})
