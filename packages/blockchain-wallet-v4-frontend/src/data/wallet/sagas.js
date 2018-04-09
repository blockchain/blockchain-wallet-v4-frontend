import { takeEvery, call, put } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../actions.js'
import { askSecondPasswordEnhancer, promptForSecondPassword, promptForInput } from 'services/SagaService'

export default ({ coreSagas }) => {
  const importLegacyAddress = function * (action, password) {
    let { addr, priv, to, bipPass } = action.payload
    if (password == null) { password = yield call(promptForSecondPassword) }

    try {
      let key = priv == null ? addr : priv
      yield call(coreSagas.wallet.importLegacyAddress, { key, password, bipPass })
      yield put(actions.alerts.displaySuccess('Address added succesfully.'))

      if (to && priv) {
        try {
          yield coreSagas.data.bitcoin.sweepAddress(addr, priv, { index: to.index, password })
          yield put(actions.alerts.displaySuccess(`Swept address funds to ${to.label}`))
        } catch (error) {
          yield put(actions.alerts.displayError('Could not sweep address.'))
        }
      }

      yield call(coreSagas.wallet.refetchContextData)
      yield put(actions.modals.closeModal())
    } catch (error) {
      switch (error.message) {
        case 'present_in_wallet':
          yield put(actions.alerts.displayError('This address already exists in your wallet.'))
          break
        case 'unknown_key_format':
          yield put(actions.alerts.displayError('This address format is not supported.'))
          break
        case 'wrong_bip38_pass':
          yield put(actions.alerts.displayError('Incorrect BIP38 password.'))
          break
        case 'needs_bip38':
          let bipPass = yield call(promptForInput, { title: 'Enter BIP38 Password', secret: true })
          let action = actions.wallet.importLegacyAddress(addr, priv, to, bipPass)
          yield importLegacyAddress(action, password)
          break
        default:
          console.log(error)
          yield put(actions.alerts.displayError('Error adding address.'))
      }
    }
  }

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

  return function * () {
    yield takeEvery(AT.TOGGLE_SECOND_PASSWORD, toggleSecondPassword)
    yield takeEvery(AT.UPDATE_PBKDF2_ITERATIONS, updatePbkdf2Iterations)
    yield takeEvery(AT.IMPORT_LEGACY_ADDRESS, importLegacyAddress)
    yield takeEvery(AT.VERIFY_MNEMONIC, verifyMmenonic)
    yield takeEvery(AT.EDIT_HD_LABEL, editHdLabel)
    yield takeEvery(AT.EDIT_BTC_ACCOUNT_LABEL, editBtcAccountLabel)
  }
}
