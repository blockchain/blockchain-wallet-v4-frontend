import { FETCH_ACTIVITIES_SUCCESSFUL } from '../actionTypes'
import { call, put } from 'redux-saga/effects'

function * fetchActivities () {
  const response = yield call(function () {
    return [
      { type: 'settings', time: '', title: 'Settings', description: 'Created wallet!' },
      { type: 'settings', time: '', title: 'Settings', description: 'Set password' },
      { type: 'address', time: '', title: 'Addresses', description: 'Created My Bitcoin Wallet' },
      { type: 'transaction', time: '', title: 'Transaction', description: 'Received' }
    ]
  })
  yield put({type: FETCH_ACTIVITIES_SUCCESSFUL, activities: response})
}

export default {
  fetchActivities
}
