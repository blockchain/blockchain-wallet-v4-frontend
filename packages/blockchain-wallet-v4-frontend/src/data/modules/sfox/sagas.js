import { takeLatest, put, call } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as sagas from '../../sagas.js'
import { actions } from 'data'

export const setBankManually = function * (action) { // will have to call this by dispatching action
  try {
    yield call(sagas.core.data.sfox.setBankManually, action.payload)
    yield put(actions.alerts.displaySuccess('Bank has been added!'))
  } catch (e) {
    console.warn(e)
    yield put(actions.alerts.displayError('Could not add bank. Please try again.'))
    // can dispatch an action here to set some kind of state
  }
}

export const signup = function * () {
  try {
    yield call(sagas.core.data.sfox.signup)
    yield put(actions.alerts.displaySuccess('Account successfully created!'))
  } catch (e) {
    console.warn(e)
    yield put(actions.alerts.displayError('Error creating account'))
  }
}

export default function * () {
  yield takeLatest(AT.SET_BANK_MANUALLY, setBankManually)
  yield takeLatest(AT.SIGNUP, signup)
}
