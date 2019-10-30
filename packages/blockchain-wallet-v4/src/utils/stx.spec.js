import { deriveAddress } from './stx'

describe('deriveAddress', () => {
  it('should derive correct address', () => {
    expect(
      deriveAddress(
        'rubber recipe vote copper obtain negative erosion strong kingdom thank tomato void'
      )
    ).toBe('1EaiavwwQY2eE2vff5JJGo89dRC13xRM7f')

    expect(
      deriveAddress(
        'one remember hint unlock finger reform utility acid speed cushion split client bitter myself protect actor frame forward rather better mercy clay card awesome'
      )
    ).toBe('1LJepqGsKKLPxFumnzFndsWTWsaCfkSDTp')
  })
})
