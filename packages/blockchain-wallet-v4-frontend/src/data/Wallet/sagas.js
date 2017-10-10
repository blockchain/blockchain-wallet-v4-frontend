import { takeEvery, call, put } from 'redux-saga/effects'
import { walletSaga } from 'blockchain-wallet-v4/src/redux/wallet/sagas.js'
import * as AT from './actionTypes'
import { actions } from 'data'
import { api } from 'services/ApiService'
import { askSecondPasswordEnhancer } from 'services/SecondPasswordService'
import settings from 'config'

const walletSagas = walletSaga({ api, walletPath: settings.WALLET_IMMUTABLE_PATH })

const createLegacyAddress = function * (action) {
  const saga = askSecondPasswordEnhancer(walletSagas.createLegacyAddress)
  try {
    yield call(saga, action.payload)
    yield put(actions.alerts.displaySuccess('Address added succesfully.'))
  } catch (error) {
    yield put(actions.alerts.displayError('Error adding address.'))
  }
}

const updatePbkdf2Iterations = function * (action) {
  const saga = askSecondPasswordEnhancer(walletSagas.updatePbkdf2Iterations)
  try {
    yield call(saga, action.payload)
    yield put(actions.alerts.displaySuccess('PBKDF2 iterations changed successfully.'))
  } catch (error) {
    yield put(actions.alerts.displayError('Error changing PBKDF2 iterations.'))
  }
}

const toggleSecondPassword = function * (action) {
  const { password } = action.payload
  try {
    yield call(walletSagas.toggleSecondPassword, { password })
    yield put(actions.alerts.displaySuccess('Second password toggle successful.'))
  } catch (error) {
    yield put(actions.alerts.displayError('Error toggling second password.'))
  }
}

function * sagas () {
  yield takeEvery(AT.TOGGLE_SECOND_PASSWORD, toggleSecondPassword)
  yield takeEvery(AT.UPDATE_PBKDF2_ITERATIONS, updatePbkdf2Iterations)
  yield takeEvery(AT.CREATE_LEGACY_ADDRESS, createLegacyAddress)
}

export default sagas
