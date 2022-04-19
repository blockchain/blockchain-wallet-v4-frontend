import { convertInputCurrencyToNumber } from '.'

describe('convertInputCurrencyToNumber()', () => {
  it('Should convert USD to number', () => {
    const result = convertInputCurrencyToNumber('USD', '200')

    expect(result).toEqual(2)
  })

  it('Should convert USD to number and keep the cents', () => {
    const result = convertInputCurrencyToNumber('USD', '2456')

    expect(result).toEqual(24.56)
  })
})
