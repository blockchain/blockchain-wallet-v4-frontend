import { prop } from 'ramda'
import { call, put, select } from 'redux-saga/effects'

import { utils } from 'blockchain-wallet-v4/src'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { actions, selectors } from 'data'
import * as C from 'services/alerts'
import { promptForInput, promptForSecondPassword } from 'services/sagas'

export default ({ api, coreSagas, networks }) => {
  const logLocation = 'components/importBtcAddress/sagas'

  const importBtcAddressSubmitClicked = function * () {
    const form = yield select(selectors.form.getFormValues('importBtcAddress'))
    const value = prop('addrOrPriv', form)
    const to = prop('to', form)
    const label = prop('label', form)

    // private key handling
    if (value && utils.btc.isValidBtcPrivateKey(value, networks.btc)) {
      let address
      const format = utils.btc.detectPrivateKeyFormat(value)
      try {
        const key = utils.btc.privateKeyStringToKey(value, format)
        address = key.getAddress()
      } catch (error) {
        yield put(
          actions.logs.logErrorMessage(
            logLocation,
            'importBtcAddressSubmitClicked',
            error
          )
        )
      }
      yield call(importLegacyAddress, address, value, null, null, to, label)
      return
    }

    // address handling (watch-only)
    if (
      value &&
      utils.btc.isValidBtcAddress(value, networks.btc) &&
      !utils.btc.isSegwitAddress(value)
    ) {
      yield call(importLegacyAddress, value, null, null, null, null, label)
    }
  }

  const sweepImportedToAccount = function * (priv, to, password) {
    const index = prop('index', to)
    if (utils.checks.isPositiveInteger(index) && priv) {
      try {
        yield coreSagas.payment.btc
          .create({ network: networks.btc })
          .chain()
          .init()
          .from(priv, ADDRESS_TYPES.ADDRESS)
          .fee('regular')
          .to(index, ADDRESS_TYPES.ACCOUNT)
          .description('Imported address swept')
          .buildSweep()
          .sign(password)
          .publish()
          .done()
        yield put(
          actions.alerts.displaySuccess(C.SWEEP_SUCCESS, { label: to.label })
        )
      } catch (error) {
        yield put(
          actions.logs.logErrorMessage(
            logLocation,
            'sweepImportedToAccount',
            error
          )
        )
        if (error.message === 'empty_addresses') {
          yield put(actions.alerts.displaySuccess(C.SWEEP_ERROR_EMPTY_ADDRESS))
        } else {
          yield put(actions.alerts.displayError(C.SWEEP_ERROR))
        }
      }
    }
  }

  const importLegacyAddress = function * (
    address,
    priv,
    secPass,
    bipPass,
    to,
    label
  ) {
    // TODO :: check if address and priv are corresponding each other
    // (how do we respond to weird pairs of compressed/uncompressed)
    let password
    try {
      password = secPass || (yield call(promptForSecondPassword))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'importLegacyAddress', e)
      )
    }
    try {
      const key = priv || address
      yield call(coreSagas.wallet.importLegacyAddress, {
        key,
        password,
        bipPass,
        label
      })
      yield put(actions.alerts.displaySuccess(C.IMPORT_LEGACY_SUCCESS))
      yield sweepImportedToAccount(priv, to, password)
      yield call(coreSagas.wallet.refetchContextData)
      yield put(actions.modals.closeAllModals())
    } catch (error) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'importLegacyAddress', error)
      )
      switch (error.message) {
        case 'present_in_wallet':
          yield put(actions.alerts.displayError(C.ADDRESS_DOES_NOT_EXIST_ERROR))
          break
        case 'unknown_key_format':
          yield put(
            actions.alerts.displayError(C.ADDRESS_FORMAT_NOT_SUPPORTED_ERROR)
          )
          break
        case 'wrong_bip38_pass':
          yield put(
            actions.alerts.displayError(C.INCORRECT_BIP38_PASSWORD_ERROR)
          )
          break
        case 'needs_bip38':
          let bipPass = yield call(promptForInput, {
            title: 'Enter BIP38 Password',
            secret: true
          })
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
