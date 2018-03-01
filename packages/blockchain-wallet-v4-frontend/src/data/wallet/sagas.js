import { takeEvery, call, put, select } from 'redux-saga/effects'
import { map, set } from 'ramda'
import * as AT from './actionTypes'
import * as actions from '../actions.js'
import * as sagas from '../sagas.js'
import * as selectors from '../selectors'
import { askSecondPasswordEnhancer, promptForSecondPassword, promptForInput } from 'services/SagaService'
import { CoinSelection, Coin } from 'blockchain-wallet-v4/src'

export const createLegacyAddress = function * (action) {
  let { addr, priv, to } = action.payload
  let key = priv == null ? addr : priv
  let password = yield call(promptForSecondPassword)

  let importAddress = function * () {
    yield call(sagas.core.wallet.createLegacyAddress, { key, password })
    yield put(actions.alerts.displaySuccess('Address added succesfully.'))
  }

  try {
    if (to) {
      try {
        let network
        let feePerByte = 15
        let receiveAddress = yield select(selectors.core.common.bitcoin.getNextAvailableReceiveAddress(network, to.index))

        yield importAddress()

        let coins = yield sagas.core.data.bitcoin.fetchUnspent([addr])
        let coinsWithPriv = map(set(Coin.priv, priv), coins)
        let selection = receiveAddress.map(a => CoinSelection.selectAll(feePerByte, coinsWithPriv, a)).getOrElse(null)

        if (selection) {
          yield sagas.core.data.bitcoin.signAndPublish({ network, selection, password })
          yield put(actions.alerts.displaySuccess(`Swept address funds to ${to.label}`))
        }
      } catch (error) {
        console.log(error)
        yield put(actions.alerts.displayError('Could not sweep address.'))
      }
    } else {
      yield importAddress()
    }
  } catch (error) {
    console.log(error)
    yield put(actions.alerts.displayError('Error adding address.'))
  }
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
  console.log('frontend saga')
  yield put(actions.alerts.displaySuccess('Your mnemonic has been verified !'))
}

export const editHdLabel = function * (action) {
  try {
    let { accountIdx, addressIdx } = action.payload
    let newLabel = yield call(promptForInput, { title: 'Rename Address Label' })
    yield put(actions.core.wallet.setHdAddressLabel(accountIdx, addressIdx, newLabel))
    yield put(actions.alerts.displaySuccess('Address label updated.'))
  } catch (e) {
  }
}

export const editAccountLabel = function * (action) {
  try {
    let { index, label } = action.payload
    let newLabel = yield call(promptForInput, { title: 'Rename Wallet', initial: label })
    yield put(actions.core.wallet.setAccountLabel(index, newLabel))
    yield put(actions.alerts.displaySuccess('Wallet name updated.'))
  } catch (e) {
  }
}

export default function * () {
  yield takeEvery(AT.TOGGLE_SECOND_PASSWORD, toggleSecondPassword)
  yield takeEvery(AT.UPDATE_PBKDF2_ITERATIONS, updatePbkdf2Iterations)
  yield takeEvery(AT.CREATE_LEGACY_ADDRESS, createLegacyAddress)
  yield takeEvery(AT.VERIFY_MNEMONIC, verifyMmenonic)
  yield takeEvery(AT.EDIT_HD_LABEL, editHdLabel)
  yield takeEvery(AT.EDIT_ACCOUNT_LABEL, editAccountLabel)
}
