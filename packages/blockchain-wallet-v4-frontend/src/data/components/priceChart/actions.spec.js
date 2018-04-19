import * as A from './actions'
import * as AT from './actionTypes'

export const initialized = (coin, time) => ({ type: AT.PRICE_CHART_INITIALIZED, payload: { coin, time } })

export const timeClicked = (time) => ({ type: AT.PRICE_CHART_TIME_CLICKED, payload: { time } })

export const coinClicked = (coin) => ({ type: AT.PRICE_CHART_COIN_CLICKED, payload: { coin } })

describe('priceChart actions', () => {
  it('initialized should return proper action', () => {
    const coin = 'BTC'
    const time = 'all'
    const expectedResult = ({ type: AT.PRICE_CHART_INITIALIZED, payload: { coin, time } })
    expect(A.initialized(coin, time)).toEqual(expectedResult)
  })

  it('timeClicked should return proper action', () => {
    const time = 'all'
    const expectedResult = ({ type: AT.PRICE_CHART_TIME_CLICKED, payload: { time } })
    expect(A.timeClicked(time)).toEqual(expectedResult)
  })

  it('coinClicked should return proper action', () => {
    const coin = 'BTC'
    const expectedResult = ({ type: AT.PRICE_CHART_COIN_CLICKED, payload: { coin } })
    expect(A.coinClicked(coin)).toEqual(expectedResult)
  })
})
