import { takeEvery, takeLatest, call, put, spawn } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import * as AT from './actionTypes'
import * as actions from '../actions.js'
import * as sagas from '../sagas.js'
import { askSecondPasswordEnhancer, promptForSecondPassword, promptForInput } from 'services/SagaService'

// export const importLegacyAddress = function * (action, password) {
//   let { addr, priv, to, bipPass } = action.payload
//   if (password == null) { password = yield call(promptForSecondPassword) }

//   try {
//     let key = priv == null ? addr : priv
//     yield call(sagas.core.wallet.importLegacyAddress, { key, password, bipPass })
//     yield put(actions.alerts.displaySuccess('Address added succesfully.'))

//     if (to && priv) {
//       try {
//         yield sagas.core.data.bitcoin.sweepAddress(addr, priv, { index: to.index, password })
//         yield put(actions.alerts.displaySuccess(`Swept address funds to ${to.label}`))
//       } catch (error) {
//         yield put(actions.alerts.displayError('Could not sweep address.'))
//       }
//     }

//     yield call(sagas.core.wallet.refetchContextData)
//     yield put(actions.modals.closeModal())
//   } catch (error) {
//     switch (error.message) {
//       case 'present_in_wallet':
//         yield put(actions.alerts.displayError('This address already exists in your wallet.'))
//         break
//       case 'unknown_key_format':
//         yield put(actions.alerts.displayError('This address format is not supported.'))
//         break
//       case 'wrong_bip38_pass':
//         yield put(actions.alerts.displayError('Incorrect BIP38 password.'))
//         break
//       case 'needs_bip38':
//         let bipPass = yield call(promptForInput, { title: 'Enter BIP38 Password', secret: true })
//         let action = actions.wallet.importLegacyAddress(addr, priv, to, bipPass)
//         yield importLegacyAddress(action, password)
//         break
//       default:
//         console.log(error)
//         yield put(actions.alerts.displayError('Error adding address.'))
//     }
//   }
// }

export const importLegacyAddress = function * (action, password) {
  yield delay(1000)
  console.log('NOT IMPLEMENTED NOW!!!!!!!!')
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
  yield put(actions.alerts.displaySuccess('Your mnemonic has been verified !'))
}

export const editHdLabel = function * (action) {
  try {
    let { accountIdx, addressIdx } = action.payload
    let newLabel = yield call(promptForInput, { title: 'Rename Address Label' })
    yield put(actions.core.wallet.setHdAddressLabel(accountIdx, addressIdx, newLabel))
    yield put(actions.alerts.displaySuccess('Address label updated.'))
  } catch (e) {
    console.log('error in editHdLabel generator')
  }
}

export const editBtcAccountLabel = function * (action) {
  try {
    let { index, label } = action.payload
    let newLabel = yield call(promptForInput, { title: 'Rename Bitcoin Wallet', initial: label })
    yield put(actions.core.wallet.setAccountLabel(index, newLabel))
    yield put(actions.alerts.displaySuccess('BTC wallet name updated.'))
  } catch (e) {
    console.log('error in editBtcAccountLabel generator')
  }
}

function * payment1 () {
  let payment = sagas.core.data.bitcoin.createPayment()
  payment = yield payment.init()
  payment = yield payment.to('14sWEbHKo6dd8enrovqm9ggLSd4wSVy9zc')
  payment = yield payment.amount(300)
  payment = yield payment.from(1)
  payment = yield payment.fee(0)
  payment = yield payment.build()
  payment = yield payment.sign('hola')
  console.log(1, payment.value())
}

function * payment2 () {
  let payment = yield sagas.core.data.bitcoin.createPayment()
    .chain()
    .init()
    .to('14sWEbHKo6dd8enrovqm9ggLSd4wSVy9zc')
    .amount(600)
    .from('15RqhGzyEUyUcCm12942Qu3qfpshzagTbk')
    .fee(0)
    .build()
    .sign('hola')
    .done()
  console.log(2, payment.value())
}

export default function * () {
  yield takeEvery(AT.TOGGLE_SECOND_PASSWORD, toggleSecondPassword)
  yield takeEvery(AT.UPDATE_PBKDF2_ITERATIONS, updatePbkdf2Iterations)
  yield takeEvery(AT.IMPORT_LEGACY_ADDRESS, importLegacyAddress)
  yield takeEvery(AT.VERIFY_MNEMONIC, verifyMmenonic)
  yield takeEvery(AT.EDIT_HD_LABEL, editHdLabel)
  yield takeEvery(AT.EDIT_BTC_ACCOUNT_LABEL, editBtcAccountLabel)
  yield takeLatest('P', function * () {
    yield spawn(payment1)
    yield spawn(payment2)
  })
}
