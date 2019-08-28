import * as selectors from './selectors'

describe('priceChart selectors', () => {
  it('getCoin should return selected coin', () => {
    const state = { components: { priceChart: { time: 'all', coin: 'BTC' } } }
    const expectedResult = 'BTC'
    expect(selectors.getCoin(state)).toEqual(expectedResult)
  })

  it('getTime should return selected time', () => {
    const state = { components: { priceChart: { time: 'all', coin: 'BTC' } } }
    const expectedResult = 'all'
    expect(selectors.getTime(state)).toEqual(expectedResult)
  })
})
