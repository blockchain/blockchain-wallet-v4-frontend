import { normalizeCreditCard } from './index'

describe('normalizeCreditCard', () => {
  it('should normalize a cc number', () => {
    expect(normalizeCreditCard('123456')).toBe('1234 56')
    expect(normalizeCreditCard('12345678')).toBe('1234 5678')
    expect(normalizeCreditCard('12345678901')).toBe('1234 5678 901')
    expect(normalizeCreditCard('123456789012')).toBe('1234 5678 9012')
    expect(normalizeCreditCard('invalid_characters!@#$%^&&*()+')).toBe('')
  })
})
