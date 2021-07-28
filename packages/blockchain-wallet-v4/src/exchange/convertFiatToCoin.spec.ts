import { btcRates } from './conversion.textures'
import * as Conversion from './index'

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
