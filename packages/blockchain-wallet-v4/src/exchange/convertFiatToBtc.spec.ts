import { btcRates } from './conversion.textures'
import * as Conversion from './index'

describe('convertFiatToCoin', () => {
  it('should return correct value', () => {
    const expectedOutput = '0.00015174'
    const result = Conversion.convertFiatToCoin(
      'BTC',
      1,
      'BTC',
      'USD',
      btcRates
    )
    expect(result).toEqual(expectedOutput)
  })

  it('should return value 0 if value is undefined ', () => {
    const expectedOutput = '0'
    const result = Conversion.convertFiatToCoin(
      'BTC',
      // @ts-ignore
      undefined,
      'BTC',
      'USD',
      btcRates
    )
    expect(result).toEqual(expectedOutput)
  })

  it('should return default if currency is undefined', () => {
    const result = Conversion.convertFiatToCoin(
      'BTC',
      1,
      'BTC',
      // @ts-ignore
      undefined,
      btcRates
    )
    expect(result).toEqual(Conversion.DefaultConversion.value)
  })
})
