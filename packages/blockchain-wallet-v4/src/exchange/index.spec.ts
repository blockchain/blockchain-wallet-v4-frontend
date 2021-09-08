import { btcRates } from './conversion.textures'
import * as Conversion from './index'

describe('convertCoinToCoin', () => {
  it('should return correct value', () => {
    const expectedOutput = '100000000'
    const result = Conversion.convertCoinToCoin({
      baseToStandard: false,
      coin: 'BTC',
      value: 1
    })
    expect(result).toEqual(expectedOutput)
  })

  it('should handle overflows', () => {
    const expectedOutput = '7480763750356227'
    const result = Conversion.convertCoinToCoin({
      baseToStandard: false,
      coin: 'AAVE',
      value: 0.0074807637503562265
    })
    expect(result).toEqual(expectedOutput)
  })
})

describe('convertFiatToCoin', () => {
  it('should return correct value', () => {
    const expectedOutput = '0.00015175'
    const result = Conversion.convertFiatToCoin({
      coin: 'BTC',
      currency: 'USD',
      rates: btcRates,
      value: 1
    })
    expect(result).toEqual(expectedOutput)
  })

  it('should return value 0 if value is undefined', () => {
    const expectedOutput = '0.00000000'
    const result = Conversion.convertFiatToCoin({
      coin: 'BTC',

      currency: 'USD',

      rates: btcRates,
      // @ts-ignore
      value: undefined
    })
    expect(result).toEqual(expectedOutput)
  })
})
