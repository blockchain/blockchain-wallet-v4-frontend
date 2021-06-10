import * as Bitcoin from 'bitcoinjs-lib'
import { assoc, find, is, prop, propEq } from 'ramda'
import { call, delay, fork, put, race, select, take } from 'redux-saga/effects'

import { Remote, Types } from 'blockchain-wallet-v4/src'
import { DEFAULT_INVITATIONS } from 'blockchain-wallet-v4/src/model'
import { actions, actionTypes, model, selectors } from 'data'
import * as C from 'services/alerts'
import { checkForVulnerableAddressError } from 'services/misc'
import { askSecondPasswordEnhancer, confirm, promptForSecondPassword } from 'services/sagas'

import { guessCurrencyBasedOnCountry } from './helpers'

const { MOBILE_LOGIN } = model.analytics

export const logLocation = 'auth/sagas'
export const defaultLoginErrorMessage = 'Error logging into your wallet'
export const wrongWalletPassErrorMessage = 'wrong_wallet_password'
export const wrongAuthCodeErrorMessage = 'Authentication code is incorrect'

export default ({ api, coreSagas }) => {
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

  const upgradeWallet = function* ({ payload }) {
    try {
      const { version } = payload
      const password = yield call(promptForSecondPassword)
      // eslint-disable-next-line default-case
      switch (version) {
        case 3:
          yield coreSagas.wallet.upgradeToV3({ password })
          break
        case 4:
          yield coreSagas.wallet.upgradeToV4({ password })
          break
      }
      yield call(forceSyncWallet)
    } catch (e) {
      // TODO: SEGWIT (modals are mounted twice)
      if (e.message === 'Already a v4 wallet') return
      yield put(actions.logs.logErrorMessage(logLocation, 'upgradeWallet', e))
      yield put(actions.alerts.displayError(C.WALLET_UPGRADE_ERROR))
      yield put(actions.modals.closeModal())
    }
  }

  const upgradeAddressLabelsSaga = function* () {
    const addressLabelSize = yield call(coreSagas.kvStore.btc.fetchMetadataBtc)
    if (addressLabelSize > 100) {
      yield put(
        actions.modals.showModal('UpgradeAddressLabels', {
          duration: addressLabelSize / 20
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

  const saveGoals = function* (firstLogin) {
    // only for non first login users we save goal here for first login users we do that over verify email page
    if (!firstLogin) {
      yield put(actions.goals.saveGoal('welcomeModal'))
    }
    yield put(actions.goals.saveGoal('swapUpgrade'))
    yield put(actions.goals.saveGoal('swapGetStarted'))
    yield put(actions.goals.saveGoal('kycDocResubmit'))
    yield put(actions.goals.saveGoal('transferEth'))
    yield put(actions.goals.saveGoal('syncPit'))
    yield put(actions.goals.saveGoal('interestPromo'))
    // when airdrops are running
    // yield put(actions.goals.saveGoal('upgradeForAirdrop'))
    // yield put(actions.goals.saveGoal('airdropClaim'))
  }

  const startSockets = function* () {
    yield put(actions.middleware.webSocket.coins.authSocket())
    yield put(actions.middleware.webSocket.xlm.startStreams())
  }

  const authNabu = function* () {
    yield put(actions.components.identityVerification.fetchSupportedCountries())
    yield take([
      actionTypes.components.identityVerification.SET_SUPPORTED_COUNTRIES_SUCCESS,
      actionTypes.components.identityVerification.SET_SUPPORTED_COUNTRIES_FAILURE
    ])
    yield put(actions.modules.profile.signIn())
  }

  const fetchBalances = function* () {
    yield put(actions.core.data.bch.fetchData())
    yield put(actions.core.data.btc.fetchData())
    yield put(actions.core.data.eth.fetchData())
    yield put(actions.core.data.xlm.fetchData())
    yield put(actions.core.data.eth.fetchErc20Data('pax'))
    yield put(actions.core.data.eth.fetchErc20Data('usdt'))
    yield put(actions.core.data.eth.fetchErc20Data('wdgld'))
    yield put(actions.core.data.eth.fetchErc20Data('aave'))
    yield put(actions.core.data.eth.fetchErc20Data('yfi'))
  }

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

  const checkXpubCacheLegitimacy = function* () {
    const wallet = yield select(selectors.core.wallet.getWallet)
    const accounts = Types.Wallet.selectHDAccounts(wallet)
    const first5 = accounts.slice(0, 5)

    let isValidReceive = true
    let isValidChange = true
    first5.forEach((account) => {
      account.derivations.forEach((derivation) => {
        const { cache, xpub } = derivation
        const { changeAccount, receiveAccount } = cache
        const accountNode = Bitcoin.bip32.fromBase58(xpub)

        const validReceive = accountNode.derive(0).neutered().toBase58()
        const validChange = accountNode.derive(1).neutered().toBase58()

        if (receiveAccount !== validReceive) {
          isValidReceive = false
          // eslint-disable-next-line
          console.log(`Receive cache is incorrect for ${derivation.type} at ${account.index}`)
        }
        if (changeAccount !== validChange) {
          isValidChange = false
          // eslint-disable-next-line
          console.log(`Change cache is incorrect for ${derivation.type} at ${account.index}`)
        }
      })
    })

    if (!isValidReceive) {
      yield put(actions.auth.logWrongReceiveCache())
    }

    if (!isValidChange) {
      yield put(actions.auth.logWrongChangeCache())
    }
  }

  const checkExchangeUsage = function* () {
    try {
      const accountsR = yield select(selectors.core.common.btc.getActiveHDAccounts)
      const accounts = accountsR.getOrElse([])
      const defaultIndex = yield select(selectors.core.wallet.getDefaultAccountIndex)
      const defaultAccount = accounts.find((account) => account.index === defaultIndex)
      if (!defaultAccount) return
      yield call(api.checkExchangeUsage, defaultAccount.xpub)
    } catch (e) {
      // eslint-disable-next-line
      // console.log(e)
    }
  }

  const setLogoutEventListener = function () {
    return new Promise((resolve) => {
      window.addEventListener('wallet.core.logout', resolve)
    })
  }

  const logoutClearReduxStore = function* () {
    // router will fallback to /login route
    yield window.history.pushState('', '', '#')
    yield window.location.reload(true)
  }

  const logout = function* () {
    try {
      yield put(actions.cache.disconnectChannelPhone())
      yield put(actions.modules.profile.clearSession())
      yield put(actions.middleware.webSocket.rates.stopSocket())
      yield put(actions.middleware.webSocket.coins.stopSocket())
      yield put(actions.middleware.webSocket.xlm.stopStreams())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'logout', e))
    } finally {
      const isEmailVerified = (yield select(selectors.core.settings.getEmailVerified)).getOrElse(0)
      // only show browser de-auth page to accounts with verified email
      // delay allows for all actions to run and complete
      // before clearing redux store
      yield delay(100)
      // eslint-disable-next-line no-unused-expressions
      isEmailVerified
        ? yield put(actions.router.push('/logout'))
        : yield call(logoutClearReduxStore)
      yield put(actions.analytics.stopSession())
    }
  }

  const logoutRoutine = function* () {
    yield call(logout)
  }

  const loginRoutineSaga = function* (mobileLogin, firstLogin) {
    try {
      // If needed, the user should upgrade its wallet before being able to open the wallet
      const isHdWallet = yield select(selectors.core.wallet.isHdWallet)
      if (!isHdWallet) {
        yield put(actions.auth.upgradeWallet(3))
        yield take(actionTypes.core.walletSync.SYNC_SUCCESS)
      }
      const isLatestVersion = yield select(selectors.core.wallet.isWrapperLatestVersion)
      yield call(coreSagas.settings.fetchSettings)
      const invitations = selectors.core.settings
        .getInvitations(yield select())
        .getOrElse(DEFAULT_INVITATIONS)
      const isSegwitEnabled = invitations.segwit
      if (!isLatestVersion && isSegwitEnabled) {
        yield put(actions.auth.upgradeWallet(4))
        yield take(actionTypes.core.walletSync.SYNC_SUCCESS)
      }
      // Finish upgrades
      yield put(actions.auth.authenticate())
      yield put(actions.auth.setFirstLogin(firstLogin))
      yield call(coreSagas.kvStore.root.fetchRoot, askSecondPasswordEnhancer)
      // If there was no eth metadata kv store entry, we need to create one and that requires the second password.
      yield call(coreSagas.kvStore.eth.fetchMetadataEth, askSecondPasswordEnhancer)
      yield put(actions.middleware.webSocket.xlm.startStreams())
      yield call(coreSagas.kvStore.xlm.fetchMetadataXlm, askSecondPasswordEnhancer)
      yield call(coreSagas.kvStore.bch.fetchMetadataBch)
      yield call(coreSagas.kvStore.lockbox.fetchMetadataLockbox)
      yield call(coreSagas.kvStore.walletCredentials.fetchMetadataWalletCredentials)
      yield call(coreSagas.data.xlm.fetchLedgerDetails)
      yield call(coreSagas.data.xlm.fetchData)

      if (firstLogin) {
        const countryCode = navigator.language.slice(-2) || 'US'
        const currency = guessCurrencyBasedOnCountry(countryCode)

        yield put(actions.core.settings.setCurrency(currency))
        // fetch settings again
        yield call(coreSagas.settings.fetchSettings)
        yield put(actions.router.push('/verify-email-step'))
      } else {
        yield put(actions.router.push('/home'))
      }

      yield call(authNabu)
      yield call(fetchBalances)
      yield call(saveGoals, firstLogin)
      yield put(actions.goals.runGoals())
      yield call(upgradeAddressLabelsSaga)
      yield put(actions.auth.loginSuccess())
      yield put(actions.auth.startLogoutTimer())
      yield call(startSockets)
      const guid = yield select(selectors.core.wallet.getGuid)
      // store guid in cache for future login
      yield put(actions.cache.guidEntered(guid))
      // reset auth type and clear previous login form state
      yield put(actions.auth.setAuthType(0))
      yield put(actions.form.destroy('login'))
      // set payload language to settings language
      const language = yield select(selectors.preferences.getLanguage)
      yield put(actions.modules.settings.updateLanguage(language))
      yield put(actions.analytics.initUserSession())
      // simple buy tasks
      // only run the fetch simplebuy if there's no simplebuygoal
      const goals = selectors.goals.getGoals(yield select())
      const simpleBuyGoal = find(propEq('name', 'simpleBuy'), goals)
      if (!simpleBuyGoal) {
        yield put(actions.components.simpleBuy.fetchSBPaymentMethods())
      }
      // swap tasks
      yield put(actions.components.swap.fetchTrades())

      // check/update btc account names
      yield call(coreSagas.wallet.checkAndUpdateWalletNames)

      yield fork(checkXpubCacheLegitimacy)
      yield fork(checkExchangeUsage)
      yield fork(checkDataErrors)
      yield fork(logoutRoutine, yield call(setLogoutEventListener))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'loginRoutineSaga', e))
      // Redirect to error page instead of notification
      yield put(actions.alerts.displayError(C.WALLET_LOADING_ERROR))
    }
  }

  const pollingSession = function* (session, n = 50) {
    if (n === 0) {
      return false
    }
    try {
      yield delay(2000)
      const response = yield call(api.pollForSessionGUID, session)
      if (prop('guid', response)) {
        return true
      }
    } catch (error) {
      return false
    }
    return yield call(pollingSession, session, n - 1)
  }

  const login = function* (action) {
    const { code, guid, mobileLogin, password, sharedKey } = action.payload
    let session = yield select(selectors.session.getSession, guid)
    try {
      if (!session) {
        session = yield call(api.obtainSessionToken)
      }
      yield put(actions.session.saveSession(assoc(guid, session, {})))
      yield put(actions.auth.loginLoading())
      yield call(coreSagas.wallet.fetchWalletSaga, {
        code,
        guid,
        password,
        session,
        sharedKey
      })
      yield call(loginRoutineSaga, mobileLogin)
    } catch (error) {
      const initialError = prop('initial_error', error)
      const authRequired = prop('authorization_required', error)

      if (authRequired) {
        // auth errors (polling)
        const authRequiredAlert = yield put(
          actions.alerts.displayInfo(C.AUTHORIZATION_REQUIRED_INFO, undefined, true)
        )
        const authorized = yield call(pollingSession, session)
        yield put(actions.alerts.dismissAlert(authRequiredAlert.payload.id))
        if (authorized) {
          try {
            yield call(coreSagas.wallet.fetchWalletSaga, {
              guid,
              password,
              session
            })
            yield call(loginRoutineSaga, mobileLogin)
          } catch (error) {
            if (error && error.auth_type > 0) {
              yield put(actions.auth.setAuthType(error.auth_type))
              yield put(actions.alerts.displayInfo(C.TWOFA_REQUIRED_INFO))
              yield put(actions.auth.loginFailure())
            } else {
              yield put(actions.auth.loginFailure(wrongWalletPassErrorMessage))
              yield put(actions.logs.logErrorMessage(logLocation, 'login', error))
            }
          }
        } else {
          yield put(actions.alerts.displayError(C.WALLET_SESSION_ERROR))
        }
      } else if (error && error.auth_type > 0) {
        // 2fa required
        // dispatch state change to show form
        yield put(actions.auth.loginFailure())
        yield put(actions.auth.setAuthType(error.auth_type))
        yield put(actions.alerts.displayInfo(C.TWOFA_REQUIRED_INFO))
        // Wrong password error
      } else if (error && is(String, error) && error.includes(wrongWalletPassErrorMessage)) {
        // remove 2fa if password is wrong
        // password error can only occur after 2fa validation
        yield put(actions.auth.setAuthType(0))
        yield put(actions.form.clearFields('login', false, true, 'password', 'code'))
        yield put(actions.form.focus('login', 'password'))
        yield put(actions.auth.loginFailure(error))
      } else if (initialError) {
        const ipRestriction =
          'This wallet is restricted to another IP address. To remove this restriction, submit a 2FA reset request under Login Help.'
        // general error
        if (initialError === ipRestriction)
          yield put(
            actions.alerts.displayError(C.IPRESTRICTION_LOGIN_ERROR, null, null, null, 9500)
          )
        yield put(actions.auth.loginFailure(initialError))
      } else if (
        // Wrong 2fa code error
        error &&
        is(String, error) &&
        error.includes(wrongAuthCodeErrorMessage)
      ) {
        yield put(actions.form.clearFields('login', false, true, 'code'))
        yield put(actions.form.focus('login', 'code'))
        yield put(actions.auth.loginFailure(error))
      } else if (error && is(String, error)) {
        yield put(actions.auth.loginFailure(error))
      } else {
        const errorMessage = prop('message', error) || defaultLoginErrorMessage
        yield put(actions.auth.loginFailure(errorMessage))
      }
    }
  }

  const mobileLogin = function* (action) {
    try {
      yield put(actions.auth.mobileLoginStarted())
      yield put(actions.analytics.logEvent(MOBILE_LOGIN.LEGACY))
      const { guid, password, sharedKey } = yield call(
        coreSagas.settings.decodePairingCode,
        action.payload
      )
      const loginAction = actions.auth.login(guid, password, undefined, sharedKey, true)
      yield call(login, loginAction)
      yield put(actions.auth.mobileLoginFinish())
    } catch (error) {
      yield put(actions.logs.logErrorMessage(logLocation, 'mobileLogin', error))
      if (error === 'qr_code_expired') {
        yield put(actions.alerts.displayError(C.MOBILE_LOGIN_ERROR_QRCODE_EXPIRED))
      } else {
        yield put(actions.alerts.displayError(C.MOBILE_LOGIN_ERROR))
      }
      yield put(actions.auth.mobileLoginFinish())
    }
  }

  const register = function* (action) {
    try {
      yield put(actions.auth.registerLoading())
      yield put(actions.auth.setRegisterEmail(action.payload.email))
      yield call(coreSagas.wallet.createWalletSaga, action.payload)
      yield put(actions.alerts.displaySuccess(C.REGISTER_SUCCESS))
      yield call(loginRoutineSaga, false, true)
      yield put(actions.auth.registerSuccess())
    } catch (e) {
      yield put(actions.auth.registerFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'register', e))
      yield put(actions.alerts.displayError(C.REGISTER_ERROR))
    }
  }

  const restoreFromMetadata = function* (action) {
    const { mnemonic } = action.payload
    try {
      yield put(actions.auth.restoreFromMetadataLoading())
      // try and pull recovery credentials from metadata
      const metadataInfo = yield call(
        coreSagas.wallet.restoreWalletCredentialsFromMetadata,
        mnemonic
      )
      yield put(actions.auth.restoreFromMetadataSuccess(metadataInfo))
    } catch (e) {
      yield put(actions.auth.restoreFromMetadataFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'restoreFromMetadata', e))
    }
  }

  const restore = function* (action) {
    try {
      yield put(actions.auth.restoreLoading())
      yield put(actions.auth.setRegisterEmail(action.payload.email))
      yield put(actions.alerts.displayInfo(C.RESTORE_WALLET_INFO))
      const kvCredentials = (yield select(selectors.auth.getMetadataRestore)).getOrElse({})
      // TODO: SEGWIT remove w/ DEPRECATED_V3
      yield call(coreSagas.wallet.restoreWalletSaga_DEPRECATED_V3, {
        ...action.payload,
        kvCredentials
      })
      yield put(actions.alerts.displaySuccess(C.RESTORE_SUCCESS))
      yield call(loginRoutineSaga, false, true, true)
      yield put(actions.auth.restoreSuccess())
    } catch (e) {
      yield put(actions.auth.restoreFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'restore', e))
      yield put(actions.alerts.displayError(C.RESTORE_ERROR))
    }
  }

  const resendSmsLoginCode = function* (action) {
    try {
      const { guid } = action.payload
      const sessionToken = yield select(selectors.session.getSession, guid)
      const response = yield call(coreSagas.wallet.resendSmsLoginCode, {
        guid,
        sessionToken
      })
      if (response.initial_error && !response.initial_error.includes('login attempts left')) {
        throw new Error(response)
      } else {
        yield put(actions.alerts.displaySuccess(C.SMS_RESEND_SUCCESS))
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'resendSmsLoginCode', e))
      yield put(actions.alerts.displayError(C.SMS_RESEND_ERROR))
    }
  }

  const deauthorizeBrowser = function* () {
    try {
      const guid = yield select(selectors.core.wallet.getGuid)
      const sessionToken = yield select(selectors.session.getSession, guid)
      yield call(api.deauthorizeBrowser, sessionToken)
      yield put(actions.alerts.displaySuccess(C.DEAUTHORIZE_BROWSER_SUCCESS))
      yield put(actions.cache.disconnectChannelPhone())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'deauthorizeBrowser', e))
      yield put(actions.alerts.displayError(C.DEAUTHORIZE_BROWSER_ERROR))
    } finally {
      yield logoutClearReduxStore()
    }
  }

  return {
    authNabu,
    checkAndHandleVulnerableAddress,
    checkDataErrors,
    deauthorizeBrowser,
    login,
    loginRoutineSaga,
    logout,
    logoutClearReduxStore,
    logoutRoutine,
    mobileLogin,
    pollingSession,
    register,
    resendSmsLoginCode,
    restore,
    restoreFromMetadata,
    saveGoals,
    setLogoutEventListener,
    startSockets,
    upgradeAddressLabelsSaga,
    upgradeWallet
  }
}
