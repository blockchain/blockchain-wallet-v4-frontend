import Reducers from './reducers'
import { LOG_EVENT } from './actionTypes'

describe('Analytics Reducers', () => {
  it('should return empty state', () => {
    expect(Reducers(undefined, {})).toEqual([])
  })

  it('should handle LOG_EVENT', () => {
    expect(Reducers({}, {
      type: LOG_EVENT,
      payload: {
        trackingData: ['send', 'click', 'send_button']
      }
    })).toEqual([{
      trackingData: ['send', 'click', 'send_button']
    }])
  })
})
