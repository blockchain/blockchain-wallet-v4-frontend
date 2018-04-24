
import { call, select, takeLatest, put } from 'redux-saga/effects'
import { identity, prop } from 'ramda'
import { formValueSelector } from 'redux-form'
import * as AT from './actionTypes'
import * as actions from '../../actions'
import { promptForSecondPassword, promptForInput } from 'services/SagaService'
import settings from 'config'
import { utils } from 'blockchain-wallet-v4/src'

export default ({ api, coreSagas }) => {
  const importBtcAddressSubmitClicked = function * (action) {
    const appState = yield select(identity)
    const address = formValueSelector('importBtcAddress')(appState, 'address')
    const priv = formValueSelector('importBtcAddress')(appState, 'priv')
    const to = formValueSelector('importBtcAddress')(appState, 'to')
    yield call(importLegacyAddress, address, priv, null, null, to)
  }

  const sweepImportedToAccount = function * (priv, to, password) {
    const index = prop('index', to)
    if (utils.checks.isPositiveInteger(index) && priv) {
      try {
        let payment = coreSagas.payment.btc.create(({network: settings.NETWORK_BITCOIN}))
        payment = yield payment.init()
        payment = yield payment.from(priv)
        payment = yield payment.fee('regular')
        payment = yield payment.to(index)
        payment = yield payment.description('Imported address sweeped') // TODO: real message here and translated
        console.log('1')
        console.log(payment.value())
        payment = yield payment.buildSweep()
        console.log('2')
        console.log(payment.value())
        payment = yield payment.sign(password)
        console.log('3')
        console.log(payment.value())
        payment = yield payment.publish()
        console.log('4')
        console.log(payment.value())
        yield put(actions.alerts.displaySuccess(`Swept address funds to ${to.label}`))
      } catch (error) {
        console.log(error)
        if (error.message === 'empty_addresses') {
          yield put(actions.alerts.displaySuccess('The imported address does not have funds.'))
        } else {
          yield put(actions.alerts.displayError('Could not sweep address.'))
        }
      }
    }
  }

  const importLegacyAddress = function * (address, priv, secPass, bipPass, to) {
    const password = secPass || (yield call(promptForSecondPassword))
    // TODO :: check if address and priv are corresponding each other
    // (how do we respond to weird pairs of compressed/uncompressed)
    try {
      const key = priv || address
      yield call(coreSagas.wallet.importLegacyAddress, { key, password, bipPass })
      yield put(actions.alerts.displaySuccess('Address added succesfully.'))
      yield sweepImportedToAccount(priv, to, password)
      yield call(coreSagas.wallet.refetchContextData)
      yield put(actions.modals.closeAllModals())
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
          yield call(importLegacyAddress, address, priv, password, bipPass, to)
          break
        default:
          yield put(actions.alerts.displayError('Error adding address.'))
      }
    }
  }

  return function * () {
    yield takeLatest(AT.IMPORT_BTC_ADDRESS_SUBMIT_CLICKED, importBtcAddressSubmitClicked)
  }
}
