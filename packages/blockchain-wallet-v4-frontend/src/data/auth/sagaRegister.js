import { takeLatest, call, put, select, take, fork } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { prop, assoc, toUpper } from 'ramda'
import Either from 'data.either'

import * as AT from './actionTypes'
import * as actions from '../actions.js'
import * as actionTypes from '../actionTypes.js'
import * as selectors from '../selectors.js'
import { askSecondPasswordEnhancer, promptForSecondPassword, forceSyncWallet } from 'services/SagaService'
import { Types } from 'blockchain-wallet-v4/src'
import sagas from './sagas'

// =============================================================================
// ================================== Addons ===================================
// =============================================================================
export default ({ api, coreSagas }) => {
  const authSagas = sagas({ api, coreSagas })

  return function* () {
    yield takeLatest(AT.LOGIN, authSagas.login)
    yield takeLatest(AT.MOBILE_LOGIN, authSagas.mobileLogin)
    yield takeLatest(AT.REGISTER, authSagas.register)
    yield takeLatest(AT.RESTORE, authSagas.restore)
    yield takeLatest(AT.REMIND_GUID, authSagas.remindGuid)
    yield takeLatest(AT.LOGOUT, authSagas.logout)
    yield takeLatest(AT.RESET_2FA, authSagas.reset2fa)
    yield takeLatest(AT.UPGRADE_WALLET, authSagas.upgradeWallet)
  }
}
