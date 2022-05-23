import { isFiatCode } from '.'

describe('isFiatCode()', () => {
  it('Should return true when the coin is fiat', () => {
    expect(isFiatCode('BRL')).toEqual(true)
  })

  it('Should return false when the coin is crypto', () => {
    expect(isFiatCode('BTC')).toEqual(false)
  })
})
