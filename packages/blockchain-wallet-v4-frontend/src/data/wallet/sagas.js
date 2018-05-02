import { takeEvery, call, put } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../actions.js'
import { askSecondPasswordEnhancer, promptForInput } from 'services/SagaService'

export default ({ coreSagas }) => {
  const updatePbkdf2Iterations = function * (action) {
    const saga = askSecondPasswordEnhancer(coreSagas.wallet.updatePbkdf2Iterations)
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
      yield call(coreSagas.wallet.toggleSecondPassword, { password })
      yield put(actions.alerts.displaySuccess('Second password toggle successful.'))
    } catch (error) {
      yield put(actions.alerts.displayError('Error toggling second password.'))
    }
  }

  const verifyMmenonic = function * (action) {
    yield put(actions.core.wallet.verifyMnemonic())
    yield put(actions.alerts.displaySuccess('Your mnemonic has been verified !'))
  }

  const editHdLabel = function * (action) {
    try {
      let { accountIdx, addressIdx } = action.payload
      let newLabel = yield call(promptForInput, { title: 'Rename Address Label' })
      yield put(actions.core.wallet.setHdAddressLabel(accountIdx, addressIdx, newLabel))
      yield put(actions.alerts.displaySuccess('Address label updated.'))
    } catch (e) {
      console.log('error in editHdLabel generator')
    }
  }

  const editBtcAccountLabel = function * (action) {
    try {
      let { index, label } = action.payload
      let newLabel = yield call(promptForInput, { title: 'Rename Bitcoin Wallet', initial: label })
      yield put(actions.core.wallet.setAccountLabel(index, newLabel))
      yield put(actions.alerts.displaySuccess('BTC wallet name updated.'))
    } catch (e) {
      console.log('error in editBtcAccountLabel generator')
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
