import { call, select, put } from 'redux-saga/effects'
import { identity, prop } from 'ramda'
import { formValueSelector } from 'redux-form'
import * as actions from '../../actions'
import * as C from 'services/AlertService'
import { promptForSecondPassword, promptForInput } from 'services/SagaService'
import settings from 'config'
import { utils } from 'blockchain-wallet-v4/src'

export default ({ api, coreSagas }) => {
  const logLocation = 'components/importBtcAddress/sagas'

  const importBtcAddressSubmitClicked = function * () {
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
        yield coreSagas.payment.btc.create(({network: settings.NETWORK_BITCOIN}))
          .chain()
          .init()
          .from(priv)
          .fee('regular')
          .to(index)
          .description('Imported address swept')
          .buildSweep()
          .sign(password)
          .publish()
          .done()
        yield put(actions.alerts.displaySuccess(C.SWEEP_SUCCESS, { label: to.label }))
      } catch (error) {
        yield put(actions.logs.logErrorMessage(logLocation, 'sweepImportedToAccount', error))
        if (error.message === 'empty_addresses') {
          yield put(actions.alerts.displaySuccess(C.SWEEP_ERROR_EMPTY_ADDRESS))
        } else {
          yield put(actions.alerts.displayError(C.SWEEP_ERROR))
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
      yield put(actions.alerts.displaySuccess(C.IMPORT_LEGACY_SUCCESS))
      yield sweepImportedToAccount(priv, to, password)
      yield call(coreSagas.wallet.refetchContextData)
      yield put(actions.modals.closeAllModals())
    } catch (error) {
      yield put(actions.logs.logErrorMessage(`${logLocation} importLegacyAddress`, error))
      switch (error.message) {
        case 'present_in_wallet':
          yield put(actions.alerts.displayError(C.ADDRESS_DOES_NOT_EXIST_ERROR))
          break
        case 'unknown_key_format':
          yield put(actions.alerts.displayError(C.ADDRESS_FORMAT_NOT_SUPPORTED_ERROR))
          break
        case 'wrong_bip38_pass':
          yield put(actions.alerts.displayError(C.INCORRECT_BIP38_PASSWORD_ERROR))
          break
        case 'needs_bip38':
          let bipPass = yield call(promptForInput, { title: 'Enter BIP38 Password', secret: true })
          yield call(importLegacyAddress, address, priv, password, bipPass, to)
          break
        default:
          yield put(actions.alerts.displayError(C.ADDRESS_ADD_ERROR))
      }
    }
  }

  return {
    importBtcAddressSubmitClicked,
    sweepImportedToAccount,
    importLegacyAddress
  }
}
