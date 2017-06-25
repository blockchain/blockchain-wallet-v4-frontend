import * as AT from './actionTypes'

const INITIAL_STATE = [
      { type: 'settings', time: '', title: 'Settings', description: 'Created wallet!' },
      { type: 'settings', time: '', title: 'Settings', description: 'Set password' },
      { type: 'address', time: '', title: 'Addresses', description: 'Created My Bitcoin Wallet' },
      { type: 'transaction', time: '', title: 'Transaction', description: 'Received' }
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
