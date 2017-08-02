import { takeLatest, call, put } from 'redux-saga/effects'
import * as AT from './actionTypes'

function * fetchActivities () {
  const response = yield call(function () {
    return [
      { type: 'settings', time: '', title: 'Settings', description: 'Created wallet!' },
      { type: 'settings', time: '', title: 'Settings', description: 'Set password' },
      { type: 'address', time: '', title: 'Addresses', description: 'Created My Bitcoin Wallet' },
      { type: 'transaction', time: '', title: 'Transaction', description: 'Received' }
    ]
  })
  yield put({type: AT.FETCH_ACTIVITIES_SUCCESSFUL, activities: response})
}

function * sagas () {
  yield takeLatest(AT.FETCH_ACTIVITIES, fetchActivities)
}

export default sagas
