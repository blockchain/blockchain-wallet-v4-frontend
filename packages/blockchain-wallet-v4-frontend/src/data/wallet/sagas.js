import { call, put } from 'redux-saga/effects'
import * as actions from '../actions.js'
import { askSecondPasswordEnhancer, promptForInput } from 'services/SagaService'

export default ({ coreSagas }) => {
  const logLocation = 'wallet/sagas'

  const updatePbkdf2Iterations = function * (action) {
    const saga = askSecondPasswordEnhancer(coreSagas.wallet.updatePbkdf2Iterations)
    try {
      yield call(saga, action.payload)
      yield put(actions.alerts.displaySuccess('PBKDF2 iterations changed successfully.'))
    } catch (error) {
      yield put(actions.logs.logErrorMessage(logLocation, 'updatePbkdf2Iterations', error))
    }
  }

  const toggleSecondPassword = function * (action) {
    const { password } = action.payload
    try {
      yield call(coreSagas.wallet.toggleSecondPassword, { password })
      yield put(actions.alerts.displaySuccess('Second password toggle successful.'))
    } catch (error) {
      yield put(actions.logs.logErrorMessage(logLocation, 'toggleSecondPassword', error))
    }
  }

  const verifyMmenonic = function * () {
    yield put(actions.core.wallet.verifyMnemonic())
    yield put(actions.alerts.displaySuccess('Your mnemonic has been verified!'))
  }

  const editHdLabel = function * (action) {
    try {
      let { accountIdx, addressIdx } = action.payload
      let newLabel = yield call(promptForInput, { title: 'Rename Address Label' })
      yield put(actions.core.wallet.setHdAddressLabel(accountIdx, addressIdx, newLabel))
      yield put(actions.alerts.displaySuccess('Address label updated.'))
    } catch (error) {
      yield put(actions.logs.logErrorMessage(logLocation, 'editHdLabel', error))
    }
  }

  const editBtcAccountLabel = function * (action) {
    try {
      let { index, label } = action.payload
      let newLabel = yield call(promptForInput, { title: 'Rename Bitcoin Wallet', initial: label })
      yield put(actions.core.wallet.setAccountLabel(index, newLabel))
      yield put(actions.alerts.displaySuccess('BTC wallet name updated.'))
    } catch (error) {
      yield put(actions.logs.logErrorMessage(logLocation, 'editBtcAccountLabel', error))
    }
  }

  return {
    toggleSecondPassword,
    updatePbkdf2Iterations,
    verifyMmenonic,
    editHdLabel,
    editBtcAccountLabel
  }
}
