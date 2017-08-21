import * as AT from './actionTypes'
import moment from 'moment'

const INITIAL_STATE = [
      { type: 'settings', time: moment().format('ll'), title: 'Settings' },
      { type: 'settings', time: moment().format('ll'), title: 'Settings' },
      { type: 'address', time: moment().format('ll'), title: 'Addresses' },
      { type: 'transaction', time: moment().format('ll'), title: 'Transaction' }
]

const activity = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AT.FETCH_ACTIVITIES: {
      return state
    }
    case AT.FETCH_ACTIVITIES_SUCCESSFUL: {
      return Array.from(action.activities)
    }
    case AT.FETCH_ACTIVITIES_FAILED: {
      return state
    }
    default:
      return state
  }
}

export default activity
