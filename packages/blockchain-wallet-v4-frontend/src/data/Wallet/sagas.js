import { takeEvery, call, put, select, take } from 'redux-saga/effects'
// import { push } from 'react-router-redux'
import { assoc, lensProp, over } from 'ramda'

import { Types } from 'blockchain-wallet-v4'
import { walletSaga } from 'blockchain-wallet-v4/src/redux/wallet/sagas.js'
import * as AT from './actionTypes'
import { actions, selectors } from 'data'
import { api } from 'services/ApiService'
import settings from 'config'

const walletSagas = walletSaga({ api, walletPath: settings.WALLET_IMMUTABLE_PATH })

const askSecondPasswordEnhancer = (coreSaga) =>
  function * (action) {
    let finalAction = action
    const wallet = yield select(selectors.core.wallet.getWallet)
    if (Types.Wallet.isDoubleEncrypted(wallet)) {
      yield put(actions.modals.showModal('SecondPassword'))
      const secPassAct = yield take(AT.SUBMIT_SECOND_PASSWORD)
      const secPass = secPassAct.payload.password
      finalAction = over(lensProp('payload'), assoc('password', secPass), action)
    }
    yield call(coreSaga, finalAction)
  }

const createLegacyAddress = function * (action) {
  const saga = askSecondPasswordEnhancer(walletSagas.createLegacyAddress)
  try {
    yield call(saga, action)
    yield put(actions.alerts.displaySuccess('Address added succesfully.'))
  } catch (error) {
    yield put(actions.alerts.displayError('Error adding address.'))
  }
}

const updatePbkdf2Iterations = function * (action) {
  const saga = askSecondPasswordEnhancer(walletSagas.updatePbkdf2Iterations)
  try {
    yield call(saga, action)
    yield put(actions.alerts.displaySuccess('PBKDF2 iterations changed successfully.'))
  } catch (error) {
    yield put(actions.alerts.displayError('Error changing PBKDF2 iterations.'))
  }
}

const toggleSecondPassword = function * (action) {
  try {
    yield call(walletSagas.toggleSecondPassword, action)
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
