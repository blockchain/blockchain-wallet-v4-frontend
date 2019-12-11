import * as C from 'services/AlertService'
import { actions, selectors } from 'data'
import { call, put, select } from 'redux-saga/effects'
import { parseBIP38toECPair } from 'blockchain-wallet-v4/src/walletCrypto/importExport'
import { promptForInput } from 'services/SagaService'
import { prop } from 'ramda'
import { utils } from 'blockchain-wallet-v4/src'
import Base58 from 'bs58'

export default ({ api, coreSagas, networks }) => {
  const logLocation = 'components/importBchAddress/sagas'

  const importBchAddressSubmitClicked = function * ({ payload: { addresses } }) {
    try {
      // get form values
      const form = yield select(
        selectors.form.getFormValues('importBchAddress')
      )
      const value = prop('addrOrPriv', form)
      const label = prop('label', form)

      // close out of modal
      yield put(actions.modals.closeAllModals())

      // handle private key
      if (value && utils.btc.isValidBtcPrivateKey(value, networks.btc)) {
        let key
        // handle bip38 password
        const format = utils.btc.detectPrivateKeyFormat(value)
        if (format === 'bip38') {
          key = yield bip38Password(value)
        } else {
          key = utils.btc.privateKeyStringToKey(value, format)
        }
        // validate input
        doesExist(
          addresses,
          Base58.encode(key.d.toBuffer(32)),
          undefined,
          label
        )

        // import to kv store
        yield put(actions.core.kvStore.bch.importLegacyAddress(key, label))
      }

      // handle address (watch-only)
      if (value && utils.bch.isCashAddr(value)) {
        // convert to btc addr
        const btcAddr = utils.bch.fromCashAddr(value)
        // error handle
        doesExist(addresses, undefined, btcAddr, label)
        yield put(actions.core.kvStore.bch.importLegacyAddress(btcAddr, label))
      }

      // display successfull
      yield put(actions.alerts.displaySuccess(C.IMPORT_LEGACY_SUCCESS))
    } catch (error) {
      switch (error.message) {
        case 'priv already exists':
          yield put(actions.alerts.displayError(C.PRIVATE_KEY_ALREADY_EXISTS))
          break
        case 'address already exists':
          yield put(actions.alerts.displayError(C.ADDRESS_DOES_NOT_EXIST_ERROR))
          break
        case 'label already exists':
          yield put(actions.alerts.displayError(C.LABEL_ALREADY_EXISTS))
          break
        default:
          yield put(
            actions.logs.logErrorMessage(
              logLocation,
              'importBchAddressSubmitClicked'
            )
          )
          break
      }
    }
  }

  const bip38Password = function * (encryptedPriv) {
    try {
      let bipPass = yield call(promptForInput, {
        title: 'Enter BIP38 Password',
        secret: true
      })
      return parseBIP38toECPair(encryptedPriv, bipPass, networks.btc)
    } catch (error) {
      // 1. error message
      yield put(actions.alerts.displayError(C.INCORRECT_BIP38_PASSWORD_ERROR))
      // 2. re-start bip38 passphrase prompt
      return yield bip38Password(encryptedPriv)
    }
  }

  const doesExist = (
    addresses,
    priv = undefined,
    address = undefined,
    label = undefined
  ) => {
    // 1. check if private key already exists
    // 2. check if address already exists
    // 3. check if label already exists
    Object.keys(addresses).forEach(addr => {
      if (addresses[addr]['priv'] === priv)
        throw new Error('priv already exists')
      if (addresses[addr]['addr'] === address)
        throw new Error('address already exists')
      if (addresses[addr]['label'] === label)
        throw new Error('label already exists')
    })
  }

  return {
    importBchAddressSubmitClicked
  }
}
