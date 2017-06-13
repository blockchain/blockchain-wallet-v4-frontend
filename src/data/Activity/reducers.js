import { FETCH_ACTIVITIES, FETCH_ACTIVITIES_SUCCESSFUL, FETCH_ACTIVITIES_FAILED } from 'data/actionTypes'

const INITIAL_STATE = [
      { type: 'settings', time: '', title: 'Settings', description: 'Created wallet!' },
      { type: 'settings', time: '', title: 'Settings', description: 'Set password' },
      { type: 'address', time: '', title: 'Addresses', description: 'Created My Bitcoin Wallet' },
      { type: 'transaction', time: '', title: 'Transaction', description: 'Received' }
]

const activity = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_ACTIVITIES: {
      return state
    }
    case FETCH_ACTIVITIES_SUCCESSFUL: {
      return Array.from(action.activities)
    }
    case FETCH_ACTIVITIES_FAILED: {
      return state
    }
    default:
      return state
  }
}

export default activity
