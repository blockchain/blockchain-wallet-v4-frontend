import { takeEvery, call, put } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../actions.js'
import * as sagas from '../sagas.js'
import { askSecondPasswordEnhancer } from 'services/SecondPasswordService'

export const addWallet = function * (action) {
  const saga = askSecondPasswordEnhancer(sagas.core.wallet.addWallet)
  try {
    yield call(saga, action.payload)
    yield put(actions.alerts.displaySuccess('Wallet added succesfully.'))
  } catch (error) {
    yield put(actions.alerts.displayError('Error adding wallet.'))
  }
}

export const createLegacyAddress = function * (action) {
  const saga = askSecondPasswordEnhancer(sagas.core.wallet.createLegacyAddress)
  try {
    yield call(saga, action.payload)
    yield put(actions.alerts.displaySuccess('Address added succesfully.'))
  } catch (error) {
    yield put(actions.alerts.displayError('Error adding address.'))
  }
}

export const setArchivedAddress = function * (action) {
  const { address } = action.payload
  yield put(actions.core.wallet.setArchivedAddress(address))
  yield put(actions.alerts.displaySuccess('Address archived succesfully.'))
}

export const updatePbkdf2Iterations = function * (action) {
  const saga = askSecondPasswordEnhancer(sagas.core.wallet.updatePbkdf2Iterations)
  try {
    yield call(saga, action.payload)
    yield put(actions.alerts.displaySuccess('PBKDF2 iterations changed successfully.'))
  } catch (error) {
    yield put(actions.alerts.displayError('Error changing PBKDF2 iterations.'))
  }
}

export const toggleSecondPassword = function * (action) {
  const { password } = action.payload
  try {
    yield call(sagas.core.wallet.toggleSecondPassword, { password })
    yield put(actions.alerts.displaySuccess('Second password toggle successful.'))
  } catch (error) {
    yield put(actions.alerts.displayError('Error toggling second password.'))
  }
}

export const verifyMmenonic = function * (action) {
  yield put(actions.core.wallet.verifyMnemonic())
  yield put(actions.modals.closeModal())
  yield put(actions.alerts.displaySuccess('Your mnemonic has been verified.'))
}

export default function * () {
  yield takeEvery(AT.TOGGLE_SECOND_PASSWORD, toggleSecondPassword)
  yield takeEvery(AT.UPDATE_PBKDF2_ITERATIONS, updatePbkdf2Iterations)
  yield takeEvery(AT.CREATE_LEGACY_ADDRESS, createLegacyAddress)
  yield takeEvery(AT.VERIFY_MNEMONIC, verifyMmenonic)
  yield takeEvery(AT.SET_ARCHIVED_ADDRESS, setArchivedAddress)
  yield takeEvery(AT.ADD_WALLET, addWallet)
}
