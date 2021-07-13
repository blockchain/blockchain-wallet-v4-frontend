import { normalizeCreditCardExpiry } from './index'

describe('normalizeCreditCardExpiry', () => {
  it('should normalize a cc expiry date', () => {
    expect(normalizeCreditCardExpiry('1 ')).toBe('1')
    expect(normalizeCreditCardExpiry('12')).toBe('12/')
    expect(normalizeCreditCardExpiry('09/')).toBe('09/')
    expect(normalizeCreditCardExpiry('/', '9')).toBe('09/')
    expect(normalizeCreditCardExpiry('12/20')).toBe('12/20')
    expect(normalizeCreditCardExpiry('invalid_characters!@#$%^&&*()+')).toBe(
      undefined
    )
  })
})
