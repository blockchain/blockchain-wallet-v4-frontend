import { call, put } from 'redux-saga/effects'
import * as actions from '../actions.js'
import * as C from 'services/AlertService'
import { askSecondPasswordEnhancer, promptForInput } from 'services/SagaService'

export default ({ coreSagas }) => {
  const logLocation = 'wallet/sagas'

  const updatePbkdf2Iterations = function * (action) {
    const saga = askSecondPasswordEnhancer(coreSagas.wallet.updatePbkdf2Iterations)
    try {
      yield call(saga, action.payload)
      yield put(actions.alerts.displaySuccess(C.PBKDF2_UPDATE_SUCCESS))
    } catch (error) {
      yield put(actions.logs.logErrorMessage(logLocation, 'updatePbkdf2Iterations', error))
    }
  }

  const toggleSecondPassword = function * (action) {
    const { password, secondPasswordEnabled } = action.payload
    try {
      yield call(coreSagas.wallet.toggleSecondPassword, { password })
      if (secondPasswordEnabled) {
        yield put(actions.alerts.displaySuccess(C.SECOND_PASSWORD_ENABLED_SUCCESS))
      } else {
        yield put(actions.alerts.displaySuccess(C.SECOND_PASSWORD_DISABLED_SUCCESS))
      }
    } catch (error) {
      yield put(actions.logs.logErrorMessage(logLocation, 'toggleSecondPassword', error))
    }
  }

  const verifyMmenonic = function * () {
    yield put(actions.core.wallet.verifyMnemonic())
    yield put(actions.alerts.displaySuccess(C.MNEMONIC_VERIFY_SUCCESS))
  }

  const editHdLabel = function * (action) {
    try {
      let { accountIdx, addressIdx } = action.payload
      let newLabel = yield call(promptForInput, { title: 'Rename Address Label' })
      yield put(actions.core.wallet.setHdAddressLabel(accountIdx, addressIdx, newLabel))
      yield put(actions.alerts.displaySuccess(C.ADDRESS_LABEL_UPDATE_SUCCESS))
    } catch (error) {
      yield put(actions.logs.logErrorMessage(logLocation, 'editHdLabel', error))
    }
  }

  const editBtcAccountLabel = function * (action) {
    try {
      let { index, label } = action.payload
      let newLabel = yield call(promptForInput, { title: 'Rename Bitcoin Wallet', initial: label })
      yield put(actions.core.wallet.setAccountLabel(index, newLabel))
      yield put(actions.alerts.displaySuccess(C.RENAME_BTC_WALLET_SUCCESS))
    } catch (error) {
      yield put(actions.logs.logErrorMessage(logLocation, 'editBtcAccountLabel', error))
    }
  }

  const setMainPassword = function * (action) {
    const { password } = action.payload
    yield put(actions.core.wallet.setMainPassword(password))
    yield call(coreSagas.kvStore.root.fetchRoot, askSecondPasswordEnhancer)
  }

  return {
    toggleSecondPassword,
    updatePbkdf2Iterations,
    verifyMmenonic,
    editHdLabel,
    editBtcAccountLabel,
    setMainPassword
  }
}
