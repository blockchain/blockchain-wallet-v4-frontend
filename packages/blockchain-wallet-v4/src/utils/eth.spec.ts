import { deriveAddress } from './eth'

describe('deriveAddress', () => {
  it('returns the correct address', () => {
    expect(
      deriveAddress(
        'business envelope ride merry time drink chat cinnamon hamster left spend gather'
      )
    ).toEqual('0x446335ca6156Fe66e610e7C47e8678cAc5a7a98A')
  })
})
