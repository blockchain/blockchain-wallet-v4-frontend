import { call, select, put } from 'redux-saga/effects'
import { identity, prop } from 'ramda'
import { formValueSelector } from 'redux-form'
import * as actions from '../../actions'
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
        coreSagas.payment.btc.create(({network: settings.NETWORK_BITCOIN}))
          .chain()
          .init()
          .fee('regular')
          .to(index)
          .description('Imported address sweeped')
          .buildSweep()
          .sign(password)
          .publish()
          .done()
        yield put(actions.alerts.displaySuccess(`Swept address funds to ${to.label}`))
      } catch (error) {
        yield put(actions.logs.logErrorMessage(logLocation, 'sweepImportedToAccount', error))
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
      yield put(actions.logs.logErrorMessage(`${logLocation} importLegacyAddress`, error))
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

  return {
    importBtcAddressSubmitClicked,
    sweepImportedToAccount,
    importLegacyAddress
  }
}
