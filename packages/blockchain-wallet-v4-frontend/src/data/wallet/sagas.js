import { call, put, select } from 'redux-saga/effects'

import { actions, selectors } from 'data'
import * as C from 'services/alerts'
import { requireUniqueWalletName } from 'services/forms'
import { askSecondPasswordEnhancer, promptForInput } from 'services/sagas'

export default ({ coreSagas }) => {
  const logLocation = 'wallet/sagas'

  const updatePbkdf2Iterations = function * (action) {
    const saga = askSecondPasswordEnhancer(
      coreSagas.wallet.updatePbkdf2Iterations
    )
    try {
      yield call(saga, action.payload)
      yield put(actions.alerts.displaySuccess(C.PBKDF2_UPDATE_SUCCESS))
    } catch (error) {
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'updatePbkdf2Iterations',
          error
        )
      )
    }
  }

  const toggleSecondPassword = function * (action) {
    const { password, secondPasswordEnabled } = action.payload
    try {
      yield call(coreSagas.wallet.toggleSecondPassword, { password })
      if (!secondPasswordEnabled) {
        yield put(
          actions.alerts.displaySuccess(C.SECOND_PASSWORD_ENABLED_SUCCESS)
        )
      } else {
        yield put(
          actions.alerts.displaySuccess(C.SECOND_PASSWORD_DISABLED_SUCCESS)
        )
      }
    } catch (error) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'toggleSecondPassword', error)
      )
    }
  }

  const verifyMmenonic = function * () {
    yield put(actions.core.wallet.verifyMnemonic())
    yield put(actions.alerts.displaySuccess(C.MNEMONIC_VERIFY_SUCCESS))
  }

  const editBtcAccountLabel = function * (action) {
    try {
      let { index, label } = action.payload
      const allWalletLabels = (yield select(
        selectors.core.common.btc.getHDAccounts
      ))
        .getOrFail()
        .map(wallet => wallet.label)
      let newLabel = yield call(promptForInput, {
        title: 'Rename Bitcoin Wallet',
        initial: label,
        maxLength: 30,
        validations: [
          value => requireUniqueWalletName(value, allWalletLabels, index)
        ]
      })
      yield put(actions.core.wallet.setAccountLabel(index, newLabel))
      yield put(actions.alerts.displaySuccess(C.RENAME_BTC_WALLET_SUCCESS))
    } catch (error) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'editBtcAccountLabel', error)
      )
    }
  }

  const setMainPassword = function * (action) {
    const { password } = action.payload
    yield put(actions.core.wallet.setMainPassword(password))
    yield call(coreSagas.kvStore.root.fetchRoot, askSecondPasswordEnhancer)
    yield call(
      coreSagas.kvStore.walletCredentials.fetchMetadataWalletCredentials
    )
  }

  return {
    toggleSecondPassword,
    updatePbkdf2Iterations,
    verifyMmenonic,
    editBtcAccountLabel,
    setMainPassword
  }
}
