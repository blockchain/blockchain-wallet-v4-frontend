import { expect } from 'chai'
import Conversion from '../../src/exchange'
import { bitcoinRates } from './conversion.textures'

const { DefaultDisplay } = Conversion

describe('displayFiatToBitcoin', () => {
  it('should return correct value', () => {
    const input = {
      value: 1,
      fromCurrency: 'USD',
      toUnit: 'BTC',
      rates: bitcoinRates
    }
    const expectedOutput = '0.00015174BTC'
    const result = Conversion.displayFiatToBitcoin(input)
    expect(result).to.deep.equals(expectedOutput)
  })

  it('should return value 0 if value is undefined ', () => {
    const input = {
      fromCurrency: 'USD',
      toUnit: 'BTC',
      rates: bitcoinRates
    }
    const expectedOutput = '0BTC'
    const result = Conversion.displayFiatToBitcoin(input)
    expect(result).to.deep.equals(expectedOutput)
  })

  it('should return default if currency is undefined', () => {
    const input = {
      value: 1,
      toUnit: 'BTC',
      rates: bitcoinRates
    }
    const result = Conversion.convertFiatToBitcoin(input)
    expect(result).to.deep.equals(DefaultDisplay)
  })

  it('should return default if currency does not exist', () => {
    const input = {
      value: 1,
      fromCurrency: 'USDDDD',
      toUnit: 'BTC',
      rates: bitcoinRates
    }
    const result = Conversion.convertFiatToBitcoin(input)
    expect(result).to.deep.equals(DefaultDisplay)
  })

  it('should return default if unit is undefined', () => {
    const input = {
      value: 1,
      fromCurrency: 'USD',
      rates: bitcoinRates
    }
    const result = Conversion.convertFiatToBitcoin(input)
    expect(result).to.deep.equals(DefaultDisplay)
  })

  it('should return default if unit does not exist', () => {
    const input = {
      value: 1,
      fromCurrency: 'USD',
      toUnit: 'BTCCCC',
      rates: bitcoinRates
    }
    const result = Conversion.convertFiatToBitcoin(input)
    expect(result).to.deep.equals(DefaultDisplay)
  })

  it('should return default if rates are undefined', () => {
    const input = {
      value: 1,
      fromCurrency: 'USD',
      toUnit: 'BTC'
    }
    const result = Conversion.convertFiatToBitcoin(input)
    expect(result).to.deep.equals(DefaultDisplay)
  })
})
