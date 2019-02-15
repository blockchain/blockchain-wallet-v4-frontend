import * as AT from './actionTypes'

export const firstStepSubmitClicked = payload => ({
  type: AT.REQUEST_BTC_FIRST_STEP_SUBMIT_CLICKED,
  payload
})

export const openLockboxAppClicked = payload => ({
  type: AT.OPEN_LOCKBOX_APP_CLICKED
})
