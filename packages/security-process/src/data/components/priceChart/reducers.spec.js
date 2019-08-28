import reducer from './reducers'
import * as actions from './actions'

const INITIAL_STATE = {
  coin: 'BTC',
  time: 'all'
}

describe('priceChart reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })

  it('should handle PRICE_CHART_INITIALIZED', () => {
    const action = actions.initialized('ETH', 'day')
    const expectedState = { coin: 'ETH', time: 'day' }
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle PRICE_CHART_TIME_CLICKED', () => {
    const action = actions.timeClicked('day')
    const expectedState = { coin: 'BTC', time: 'day' }
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle PRICE_CHART_COIN_CLICKED', () => {
    const action = actions.coinClicked('ETH')
    const expectedState = { coin: 'ETH', time: 'all' }
    expect(reducer(undefined, action)).toEqual(expectedState)
  })
})
