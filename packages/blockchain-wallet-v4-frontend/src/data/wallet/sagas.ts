import * as Bitcoin from 'bitcoinjs-lib'
import { prop } from 'ramda'
import { call, put, race, select, take } from 'redux-saga/effects'

import { Remote, Types } from '@core'
import { LEGACY_DERIVATION_TYPE } from '@core/types/HDAccount'
import { actions, actionTypes, selectors } from 'data'
import { Analytics } from 'data/analytics/types'
import { ModalName } from 'data/types'
import * as C from 'services/alerts'
import { requireUniqueWalletName } from 'services/forms'
import { checkForVulnerableAddressError } from 'services/misc'
import {
  askSecondPasswordEnhancer,
  confirm,
  promptForInput,
  promptForSecondPassword
} from 'services/sagas'

export default ({ coreSagas }) => {
  const logLocation = 'wallet/sagas'

  const checkAndHandleVulnerableAddress = function* (data) {
    const err = prop('error', data)
    const vulnerableAddress = checkForVulnerableAddressError(err)
    if (vulnerableAddress) {
      yield put(actions.modals.closeAllModals())
      const confirmed = yield call(confirm, {
        cancel: C.ARCHIVE_VULNERABLE_ADDRESS_CANCEL,
        confirm: C.ARCHIVE_VULNERABLE_ADDRESS_CONFIRM,
        message: C.ARCHIVE_VULNERABLE_ADDRESS_MSG,
        messageValues: { vulnerableAddress },
        title: C.ARCHIVE_VULNERABLE_ADDRESS_TITLE
      })
      if (confirmed) yield put(actions.core.wallet.setAddressArchived(vulnerableAddress, true))
    }
  }

  const checkDataErrors = function* () {
    const btcDataR = yield select(selectors.core.data.btc.getInfo)

    if (Remote.Loading.is(btcDataR)) {
      const btcData = yield take(actionTypes.core.data.btc.FETCH_BTC_DATA_FAILURE)
      const error = prop('payload', btcData)
      yield call(checkAndHandleVulnerableAddress, { error })
    }
    if (Remote.Failure.is(btcDataR)) {
      yield call(checkAndHandleVulnerableAddress, btcDataR)
    }
  }

  const updatePbkdf2Iterations = function* (action) {
    const saga = askSecondPasswordEnhancer(coreSagas.wallet.updatePbkdf2Iterations)
    try {
      yield call(saga, action.payload)
      yield put(actions.alerts.displaySuccess(C.PBKDF2_UPDATE_SUCCESS))
    } catch (error) {
      yield put(actions.logs.logErrorMessage(logLocation, 'updatePbkdf2Iterations', error))
    }
  }

  const toggleSecondPassword = function* (action) {
    const { password, secondPasswordEnabled } = action.payload
    try {
      yield call(coreSagas.wallet.toggleSecondPassword, { password })
      if (!secondPasswordEnabled) {
        yield put(actions.alerts.displaySuccess(C.SECOND_PASSWORD_ENABLED_SUCCESS))
      } else {
        yield put(actions.alerts.displaySuccess(C.SECOND_PASSWORD_DISABLED_SUCCESS))
      }
    } catch (error) {
      yield put(actions.logs.logErrorMessage(logLocation, 'toggleSecondPassword', error))
    }
  }

  const verifyMnemonic = function* () {
    yield put(actions.core.wallet.verifyMnemonic())
    yield put(actions.alerts.displaySuccess(C.MNEMONIC_VERIFY_SUCCESS))
  }

  const editBtcAccountLabel = function* (action) {
    try {
      const { index, label } = action.payload
      const allWalletLabels = (yield select(selectors.core.common.btc.getHDAccounts))
        .getOrFail()
        .map((wallet) => wallet.label)
      const newLabel = yield call(promptForInput, {
        initial: label,
        maxLength: 30,
        title: 'Rename Bitcoin Wallet',
        validations: [(value) => requireUniqueWalletName(value, allWalletLabels, index)]
      })
      yield put(actions.core.wallet.setAccountLabel(index, newLabel))
      yield put(actions.alerts.displaySuccess(C.RENAME_BTC_WALLET_SUCCESS))
    } catch (error) {
      yield put(actions.logs.logErrorMessage(logLocation, 'editBtcAccountLabel', error))
    }
  }

  const setMainPassword = function* (action) {
    const { password } = action.payload
    yield put(actions.core.wallet.setMainPassword(password))
    yield call(coreSagas.kvStore.root.fetchRoot, askSecondPasswordEnhancer)
    yield call(coreSagas.kvStore.walletCredentials.fetchMetadataWalletCredentials)
  }

  const forceSyncWallet = function* () {
    yield put(actions.core.walletSync.forceSync())
    const { error } = yield race({
      error: take(actionTypes.core.walletSync.SYNC_ERROR),
      success: take(actionTypes.core.walletSync.SYNC_SUCCESS)
    })
    if (error) {
      throw new Error('Sync failed')
    }
  }

  const updateMnemonicBackup = function* () {
    try {
      const lastMnemonicBackup = selectors.core.settings
        .getLastMnemonicBackup(yield select())
        .getOrElse(true)
      const isMnemonicVerified = yield select(selectors.core.wallet.isMnemonicVerified)
      if (isMnemonicVerified && !lastMnemonicBackup) {
        yield put(actions.core.wallet.updateMnemonicBackup())
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'udpateMnemonicBackup', e))
    }
  }

  const upgradeAddressLabelsSaga = function* () {
    const addressLabelSize = yield call(coreSagas.kvStore.btc.fetchMetadataBtc)
    if (addressLabelSize > 100) {
      yield put(
        actions.modals.showModal(ModalName.UPGRADE_ADDRESS_LABELS_MODAL, {
          duration: addressLabelSize / 20,
          origin: 'LoginSaga'
        })
      )
    }
    if (addressLabelSize >= 0) {
      yield call(coreSagas.kvStore.btc.createMetadataBtc)
    }
    if (addressLabelSize > 100) {
      yield put(actions.modals.closeModal())
    }
  }

  const upgradeWallet = function* (action) {
    try {
      const { version } = action.payload
      const password = yield call(promptForSecondPassword)
      // eslint-disable-next-line default-case
      switch (version) {
        case 3:
          yield coreSagas.wallet.upgradeToV3({ password })
          break
        case 4:
          yield coreSagas.wallet.upgradeToV4({ password })
          break
        default:
          break
      }
      yield call(forceSyncWallet)
    } catch (e) {
      if (e.message === 'Already a v4 wallet') return
      yield put(actions.logs.logErrorMessage(logLocation, 'upgradeWallet', e))
      yield put(actions.alerts.displayError(C.WALLET_UPGRADE_ERROR))
      yield put(actions.modals.closeModal())
    }
  }

  const checkXpubCacheLegitimacy = function* () {
    const wallet = yield select(selectors.core.wallet.getWallet)
    const accounts = Types.Wallet.selectHDAccounts(wallet)
    const first5 = accounts.slice(0, 5)

    let isValidReceive = true
    let isValidChange = true
    let shouldIgnore = false
    first5.forEach((account) => {
      const legacyDerivation = account.derivations.find(
        (derivation) => derivation.type === LEGACY_DERIVATION_TYPE
      )
      const { xpub: legacyXpub } = legacyDerivation
      const legacyAccountNode = Bitcoin.bip32.fromBase58(legacyXpub)
      const legacyReceive = legacyAccountNode.derive(0).neutered().toBase58()

      account.derivations.forEach((derivation) => {
        const { cache, xpub } = derivation
        const { changeAccount, receiveAccount } = cache
        const accountNode = Bitcoin.bip32.fromBase58(xpub)

        const validReceive = accountNode.derive(0).neutered().toBase58()
        const validChange = accountNode.derive(1).neutered().toBase58()

        if (derivation.type === 'bech32' && receiveAccount === legacyReceive) {
          shouldIgnore = true
        }

        if (receiveAccount !== validReceive) {
          isValidReceive = false
        }
        if (changeAccount !== validChange) {
          isValidChange = false
        }
      })
    })

    if (shouldIgnore) return

    if (!isValidReceive) {
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.WRONG_RECEIVE_CACHE,
          properties: {}
        })
      )
    }

    if (!isValidChange) {
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.WRONG_CHANGE_CACHE,
          properties: {}
        })
      )
    }
  }

  return {
    checkDataErrors,
    checkXpubCacheLegitimacy,
    editBtcAccountLabel,
    setMainPassword,
    toggleSecondPassword,
    updateMnemonicBackup,
    updatePbkdf2Iterations,
    upgradeAddressLabelsSaga,
    upgradeWallet,
    verifyMnemonic
  }
}
