import { RatesType } from 'core/types'

import { btcRates } from './conversion.textures'
import * as Conversion from './index'

describe('convertFiatToCoin', () => {
  it('should return correct value', () => {
    const expectedOutput = '0.00015174'
    const result = Conversion.convertFiatToCoin({
      coin: 'BTC',
      value: 1,
      rates: btcRates as RatesType,
      currency: 'USD'
    })
    expect(result).toEqual(expectedOutput)
  })

  it('should return value 0 if value is undefined ', () => {
    const expectedOutput = '0'
    const result = Conversion.convertFiatToCoin({
      coin: 'BTC',
      // @ts-ignore
      value: undefined,
      currency: 'USD',
      rates: btcRates as RatesType
    })
    expect(result).toEqual(expectedOutput)
  })

  it('should return default if currency is undefined', () => {
    const result = Conversion.convertFiatToCoin({
      coin: 'BTC',
      value: 1,
      // @ts-ignore
      currency: undefined,
      rates: btcRates as RatesType
    })
    expect(result).toEqual(Conversion.DefaultConversion.value)
  })
})
