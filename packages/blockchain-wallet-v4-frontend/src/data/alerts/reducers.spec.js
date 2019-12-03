import { ALERTS_CLEAR } from './actionTypes'
import Reducers from './reducers'

describe('Alerts Reducers', () => {
  it('should return empty state', () => {
    expect(Reducers(undefined, {})).toEqual([])
  })

  it('should handle ALERTS_CLEAR', () => {
    expect(Reducers({}, { type: ALERTS_CLEAR, payload: {} })).toEqual([])
  })
})
