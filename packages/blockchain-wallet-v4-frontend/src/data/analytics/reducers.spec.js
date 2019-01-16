import Reducers, { INITIAL_STATE } from './reducers'
import { LOG_EVENT } from './actionTypes'

describe('Analytics Reducers', () => {
  it('should return empty state', () => {
    expect(Reducers(INITIAL_STATE, {})).toEqual(INITIAL_STATE)
  })

  it('should handle LOG_EVENT', () => {
    expect(
      Reducers(INITIAL_STATE, {
        type: LOG_EVENT,
        payload: {
          trackingData: ['send', 'click', 'send_button']
        }
      })
    ).toEqual({
      events: [{ trackingData: ['send', 'click', 'send_button'] }],
      swapTiming: null
    })
  })
})
