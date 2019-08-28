import * as AT from './actionTypes'
import * as actions from './actions'

describe('request Btc actions', () => {
  it('should export first step submit action', () => {
    const payload = {}
    expect(actions.firstStepSubmitClicked(payload)).toEqual({
      type: AT.REQUEST_BTC_FIRST_STEP_SUBMIT_CLICKED,
      payload
    })
  })
})
