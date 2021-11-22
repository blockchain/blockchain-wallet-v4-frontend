import * as Bitcoin from 'bitcoinjs-lib'
import { assoc, find, prop, propEq } from 'ramda'
import { startSubmit, stopSubmit } from 'redux-form'
import { call, delay, fork, put, select, take } from 'redux-saga/effects'

import { Types } from '@core'
import { DEFAULT_INVITATIONS } from '@core/model'
import { actions, actionTypes, selectors } from 'data'
import { ModalName } from 'data/modals/types'
import profileSagas from 'data/modules/profile/sagas'
import walletSagas from 'data/wallet/sagas'
import * as C from 'services/alerts'
import { isGuid } from 'services/forms'
import { askSecondPasswordEnhancer } from 'services/sagas'

import { guessCurrencyBasedOnCountry } from './helpers'
import { parseMagicLink } from './sagas.utils'
import * as S from './selectors'
import { LoginErrorType, LoginSteps, WalletDataFromMagicLink } from './types'

export default ({ api, coreSagas, networks }) => {
  const logLocation = 'auth/sagas'
  const { createUser, generateRetailToken, setSession } = profileSagas({
    api,
    coreSagas,
    networks
  })

  const { checkDataErrors, updateMnemonicBackup, upgradeAddressLabelsSaga } = walletSagas({
    coreSagas
  })

  const saveGoals = function* (firstLogin) {
    // only for non first login users we save goal here for first login users we do that over verify email page
    if (!firstLogin) {
      yield put(actions.goals.saveGoal({ data: {}, name: 'welcomeModal' }))
    }
    yield put(actions.goals.saveGoal({ data: {}, name: 'swapUpgrade' }))
    yield put(actions.goals.saveGoal({ data: {}, name: 'swapGetStarted' }))
    yield put(actions.goals.saveGoal({ data: {}, name: 'kycDocResubmit' }))
    yield put(actions.goals.saveGoal({ data: {}, name: 'transferEth' }))
    yield put(actions.goals.saveGoal({ data: {}, name: 'syncPit' }))
    yield put(actions.goals.saveGoal({ data: {}, name: 'interestPromo' }))
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
    yield put(actions.core.data.xlm.fetchData())
    yield put(actions.core.data.eth.fetchData())
    yield put(actions.core.data.eth.fetchErc20Data())
    yield put(actions.components.refresh.refreshRates())
    yield put(actions.custodial.fetchRecentSwapTxs())
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

  const loginRoutineSaga = function* ({
    email = undefined,
    firstLogin = false,
    country = undefined,
    state = undefined,
    recovery = false
  }) {
    try {
      // If needed, the user should upgrade its wallet before being able to open the wallet
      const isHdWallet = yield select(selectors.core.wallet.isHdWallet)
      if (!isHdWallet) {
        yield put(actions.wallet.upgradeWallet(3))
        yield take(actionTypes.core.walletSync.SYNC_SUCCESS)
      }
      const isLatestVersion = yield select(selectors.core.wallet.isWrapperLatestVersion)
      yield call(coreSagas.settings.fetchSettings)
      const invitations = selectors.core.settings
        .getInvitations(yield select())
        .getOrElse(DEFAULT_INVITATIONS)
      const isSegwitEnabled = invitations.segwit
      if (!isLatestVersion && isSegwitEnabled) {
        yield put(actions.wallet.upgradeWallet(4))
        yield take(actionTypes.core.walletSync.SYNC_SUCCESS)
      }
      const isAccountReset: boolean = yield select(selectors.auth.getAccountReset)
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

      yield call(authNabu)

      if (firstLogin) {
        const countryCode = country || 'US'
        const currency = guessCurrencyBasedOnCountry(countryCode)

        yield put(actions.modules.settings.updateCurrency(currency, true))
        yield put(actions.core.settings.setCurrency(currency))

        if (!isAccountReset) {
          yield put(actions.router.push('/verify-email-step'))
        } else {
          yield put(actions.router.push('/home'))
        }
      } else {
        yield put(actions.router.push('/home'))
      }
      yield call(fetchBalances)
      yield call(saveGoals, firstLogin)
      yield put(actions.goals.runGoals())
      yield call(upgradeAddressLabelsSaga)
      yield put(actions.auth.loginSuccess({}))
      yield put(actions.auth.startLogoutTimer())
      yield call(startSockets)
      const guid = yield select(selectors.core.wallet.getGuid)
      // store guid and email in cache for future login
      yield put(actions.cache.guidEntered(guid))
      if (email) {
        yield put(actions.cache.emailStored(email))
      }
      // reset auth type and clear previous login form state
      yield put(actions.auth.setAuthType(0))
      yield put(actions.form.destroy('login'))
      // set payload language to settings language
      const language = yield select(selectors.preferences.getLanguage)
      yield put(actions.modules.settings.updateLanguage(language))
      // simple buy tasks
      // only run the fetch simplebuy if there's no simplebuygoal
      const goals = selectors.goals.getGoals(yield select())
      const buySellGoal = find(propEq('name', 'buySell'), goals)
      if (!buySellGoal) {
        yield put(actions.components.buySell.fetchPaymentMethods())
      }
      // swap tasks
      yield put(actions.components.swap.fetchTrades())
      // check/update btc account names
      yield call(coreSagas.wallet.checkAndUpdateWalletNames)
      const signupCountryEnabled = (yield select(
        selectors.core.walletOptions.getFeatureSignupCountry
      )).getOrElse(false)
      if (firstLogin && signupCountryEnabled && !isAccountReset && !recovery) {
        // create nabu user
        yield call(createUser)
        // store initial address in case of US state we add prefix
        const userState = country === 'US' ? `US-${state}` : state
        yield call(api.setUserInitialAddress, country, userState)
        yield call(coreSagas.settings.fetchSettings)
      }

      // We are checking wallet metadata to see if mnemonic is verified
      // and then syncing that information with new Wallet Account model
      // being used for SSO
      yield fork(updateMnemonicBackup)
      // ensure xpub cache is correct
      yield fork(checkXpubCacheLegitimacy)
      yield fork(checkDataErrors)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'loginRoutineSaga', e))
      // Redirect to error page instead of notification
      yield put(actions.alerts.displayError(C.WALLET_LOADING_ERROR))
    }
  }

  const pingManifestFile = function* () {
    try {
      const domains = (yield select(selectors.core.walletOptions.getDomains)).getOrElse({
        comWalletApp: 'https://login.blockchain.com'
      })
      const response = yield fetch(domains.comWalletApp)
      const raw = yield response.text()
      const nextManifest = raw.match(/manifest\.\d*.js/)[0]

      const currentManifest = yield select(S.getManifest)

      if (currentManifest && nextManifest !== currentManifest) {
        yield put(actions.modals.showModal(ModalName.NEW_VERSION_AVAILABLE, { origin: 'Unknown' }))
      }

      if (!currentManifest) {
        yield put(actions.auth.setManifestFile(nextManifest))
      }
    } catch (e) {
      // wallet failed to fetch
      // happens rarely but could happen
      // ignore error
    }

    yield delay(10_000)
    yield put(actions.auth.pingManifestFile())
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

  const pollingForMagicLinkDataSession = function* (session, n = 50) {
    if (n === 0) {
      yield put(actions.form.change('login', 'step', LoginSteps.ENTER_EMAIL_GUID))
      yield put(actions.alerts.displayInfo(C.VERIFY_DEVICE_EXPIRY, undefined, true))
      yield put(actions.auth.analyticsAuthorizeVerifyDeviceFailure('TIMED_OUT'))
      return false
    }
    try {
      yield delay(2000)
      const response = yield call(api.getMagicLinkData, session)
      if (prop('wallet', response)) {
        yield put(actions.auth.setMagicLinkInfo(response))
        yield call(parseMagicLink)
        return true
      }
      if (response.request_denied) {
        yield put(actions.form.change('login', 'step', LoginSteps.ENTER_EMAIL_GUID))
        yield put(actions.alerts.displayError(C.VERIFY_DEVICE_FAILED, undefined, true))
        return false
      }
    } catch (error) {
      return false
    }
    return yield call(pollingForMagicLinkDataSession, session, n - 1)
  }

  const login = function* (action) {
    const { code, guid, password, sharedKey } = action.payload
    const formValues = yield select(selectors.form.getFormValues('login'))
    const { email, emailToken } = formValues
    let session = yield select(selectors.session.getSession, guid, email)
    // JUST FOR ANALYTICS PURPOSES
    if (code) {
      yield put(actions.auth.loginTwoStepVerificationEntered())
    } else {
      yield put(actions.auth.loginPasswordEntered())
    }
    // JUST FOR ANALYTICS PURPOSES
    yield put(startSubmit('login'))
    try {
      if (!session) {
        session = yield call(api.obtainSessionToken)
        yield put(actions.session.saveSession(assoc(guid, session, {})))
      }
      yield put(actions.auth.loginLoading())
      if (emailToken) {
        yield call(
          coreSagas.data.misc.authorizeLogin,
          actions.core.data.misc.authorizeLogin(emailToken, true, session)
        )
        if ((yield select(selectors.core.data.misc.authorizeLogin)).error?.includes('mismatch')) {
          yield put(actions.alerts.displayError(C.DEVICE_MISMATCH))
          yield put(stopSubmit('login'))
          return
        }
      }
      yield call(coreSagas.wallet.fetchWalletSaga, {
        code,
        guid,
        password,
        session,
        sharedKey
      })
      yield call(loginRoutineSaga, {})
      yield put(stopSubmit('login'))
    } catch (e) {
      const error = e as LoginErrorType
      const initialError = typeof error !== 'string' && error.initial_error
      const errorString = typeof error === 'string' && error
      switch (true) {
        // Email authorization is required for login
        case typeof error !== 'string' && error.authorization_required:
          const authRequiredAlert = yield put(
            actions.alerts.displayInfo(C.AUTHORIZATION_REQUIRED_INFO, undefined, true)
          )
          // polling for email authorization
          const authorized = yield call(pollingSession, session)
          yield put(actions.alerts.dismissAlert(authRequiredAlert.payload.id))
          if (authorized) {
            try {
              yield call(coreSagas.wallet.fetchWalletSaga, {
                guid,
                password,
                session
              })
              yield call(loginRoutineSaga, {})
            } catch (e) {
              // If error is that 2fa is required
              const error = e as LoginErrorType
              if (typeof error !== 'string' && error?.auth_type > 0) {
                yield put(actions.auth.setAuthType(error.auth_type))
                yield put(actions.alerts.displayInfo(C.TWOFA_REQUIRED_INFO))
                yield put(actions.auth.loginFailure(undefined))
                // otherwise only other error could be wrong wallet password
              } else {
                yield put(actions.auth.loginFailure('wrong_wallet_password'))
                yield put(actions.logs.logErrorMessage(logLocation, 'login', error))
              }
            }
          } else {
            yield put(actions.alerts.displayError(C.WALLET_SESSION_ERROR))
          }
          break
        // 2FA is required for sign in
        case typeof error !== 'string' && error.auth_type > 0:
          yield put(actions.auth.loginFailure(undefined))
          yield put(actions.auth.setAuthType(typeof error !== 'string' && error.auth_type))
          yield put(actions.alerts.displayInfo(C.TWOFA_REQUIRED_INFO))
          break
        // Wrong wallet password error is just returned as a string
        case errorString && errorString.includes('wrong_wallet_password'):
          // remove 2fa if password is wrong by setting auth type to zero
          // TODO: check on why we do this
          yield put(actions.auth.setAuthType(0))
          yield put(actions.form.clearFields('login', false, true, 'password', 'code'))
          yield put(actions.form.focus('login', 'password'))
          yield put(actions.auth.loginPasswordDenied())
          yield put(actions.auth.loginFailure(errorString))
          break
        // Valid wallet ID format but it doesn't exist in bc
        case initialError && initialError.includes('Unknown Wallet Identifier'):
          yield put(actions.form.change('login', 'step', 'ENTER_EMAIL_GUID'))
          yield put(actions.auth.loginFailure(initialError))
          break
        // Security feature where user can restrict access to whitelisted IPs only
        case errorString && errorString.includes('restricted to another IP address.'):
          yield put(actions.alerts.displayError(C.IPRESTRICTION_LOGIN_ERROR))
          yield put(actions.auth.loginFailure('This wallet is restricted to another IP address.'))
          break
        // Wrong 2fa code error
        case errorString &&
          (errorString.includes('Authentication code is incorrect') ||
            errorString.includes('Invalid authentication code')):
          yield put(actions.form.clearFields('login', false, true, 'code'))
          yield put(actions.form.focus('login', 'code'))
          yield put(actions.auth.loginFailure(errorString))
          yield put(actions.auth.loginTwoStepVerificationDenied())
          break
        // Catch all to show whatever error string is returned
        case errorString:
          yield put(actions.auth.loginFailure(errorString))
          break
        default:
          const errorMessage =
            (typeof error !== 'string' && error?.message) || 'Error logging into your wallet'
          yield put(actions.auth.loginFailure(errorMessage))
      }
      yield put(stopSubmit('login'))
    }
  }

  const mobileLogin = function* (action) {
    try {
      yield put(actions.auth.mobileLoginStarted())
      const { guid, password, sharedKey } = yield call(
        coreSagas.settings.decodePairingCode,
        action.payload
      )
      const loginAction = actions.auth.login({
        code: undefined,
        guid,
        mobileLogin: true,
        password,
        sharedKey
      })
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
    const { country, email, state } = action.payload
    try {
      yield put(actions.auth.registerLoading())
      yield put(actions.auth.setRegisterEmail(email))
      yield call(coreSagas.wallet.createWalletSaga, action.payload)
      yield put(actions.alerts.displaySuccess(C.REGISTER_SUCCESS))
      yield put(actions.auth.signupDetailsEntered({ country, countryState: state }))
      yield call(loginRoutineSaga, {
        country,
        email,
        firstLogin: true,
        state
      })
      yield put(actions.auth.registerSuccess(undefined))
    } catch (e) {
      yield put(actions.auth.registerFailure(undefined))
      yield put(actions.logs.logErrorMessage(logLocation, 'register', e))
      yield put(actions.alerts.displayError(C.REGISTER_ERROR))
    }
  }

  const restoreFromMetadata = function* (action) {
    const mnemonic = action.payload
    try {
      yield put(actions.auth.restoreFromMetadataLoading())
      // try and pull recovery credentials from metadata
      const metadataInfo = yield call(
        coreSagas.wallet.restoreWalletCredentialsFromMetadata,
        mnemonic
      )
      const { guid, sharedKey } = metadataInfo
      // during recovery, we reset user kyc and generate a retail token from nabu using guid/shared key
      const { token } = yield call(api.generateRetailToken, guid, sharedKey)
      // pass that token to /user. if a user already exists, it returns
      // information associated with that user
      const { created, token: lifetimeToken, userId } = yield call(api.createUser, token)
      // if the recovered user never had a nabu account, we're creating a new user
      // so created will return true. No need to reset their kyc
      if (!created) {
        try {
          // call reset kyc
          yield call(api.resetUserKyc, userId, lifetimeToken, token)
          yield put(actions.auth.setKycResetStatus(true))
          yield put(actions.auth.restoreFromMetadataSuccess(metadataInfo))
        } catch (e) {
          // if it fails with user already being reset, shuold be allowed
          // to continue with flow
          if (e.status === 409) {
            yield put(actions.auth.restoreFromMetadataSuccess(metadataInfo))
            yield put(actions.auth.setKycResetStatus(true))
          } else {
            yield put(actions.alerts.displayError(C.KYC_RESET_ERROR))
            yield put(actions.auth.restoreFromMetadataFailure({ e }))
            yield put(actions.auth.setKycResetStatus(false))
          }
        }
      } else {
        yield put(actions.auth.restoreFromMetadataSuccess(metadataInfo))
      }
    } catch (e) {
      yield put(actions.auth.restoreFromMetadataFailure({ e }))
      yield put(actions.logs.logErrorMessage(logLocation, 'restoreFromMetadata', e))
    }
  }

  const restore = function* (action) {
    try {
      yield put(actions.auth.restoreLoading())
      yield put(actions.auth.setRegisterEmail(action.payload.email))
      yield put(actions.alerts.displayInfo(C.RESTORE_WALLET_INFO))
      const kvCredentials = (yield select(selectors.auth.getMetadataRestore)).getOrElse({})
      yield call(coreSagas.wallet.restoreWalletSaga, {
        ...action.payload,
        kvCredentials
      })

      yield call(loginRoutineSaga, {
        email: action.payload.email,
        firstLogin: true,
        recovery: true
      })
      yield put(actions.alerts.displaySuccess(C.RESTORE_SUCCESS))
      yield put(actions.auth.restoreSuccess(undefined))
    } catch (e) {
      yield put(actions.auth.restoreFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'restore', e))
      yield put(actions.alerts.displayError(C.RESTORE_ERROR))
    }
  }

  const resendSmsLoginCode = function* (action) {
    try {
      const { email, guid } = action.payload
      const sessionToken = yield select(selectors.session.getSession, guid, email)
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

  const initializeLogin = function* () {
    try {
      yield put(actions.auth.initializeLoginLoading())
      // Opens coin socket, needed for coin streams and channel key for mobile login
      yield put(actions.ws.startSocket())
      // Grab pathname to determine next step
      // Depending on if pathname is just /login
      // /login/{guid} or /login/{base64_link}
      const pathname = yield select(selectors.router.getPathname)
      const params = pathname.split('/')
      const isMobileConnected = yield select(selectors.cache.getMobileConnected)
      const email = yield select(selectors.cache.getEmail)
      // Check for both stored GUID (from email) and lastGuid (last successful login)
      const storedGuid = yield select(selectors.cache.getStoredGuid)
      const lastGuid = yield select(selectors.cache.getLastGuid)
      const loginLinkParameter = params[2]
      if ((storedGuid || lastGuid) && !loginLinkParameter) {
        // logic to be compatible with lastGuid in cache make sure that email matches
        // guid being used for login eventually can deprecate after some time
        yield put(actions.form.change('login', 'guid', lastGuid || storedGuid))
        yield put(actions.form.change('login', 'email', email))
        yield put(actions.form.change('login', 'step', LoginSteps.ENTER_PASSWORD))
        // if url is just /login, take them to enter guid or email
      } else if (!loginLinkParameter) {
        yield put(actions.form.change('login', 'step', LoginSteps.ENTER_EMAIL_GUID))
        // we detect a guid in the pathname
      } else if (isGuid(loginLinkParameter)) {
        const guidFromRoute = loginLinkParameter
        yield put(actions.form.change('login', 'guid', guidFromRoute))
        yield put(actions.form.change('login', 'step', LoginSteps.ENTER_PASSWORD))
        // if path has base64 encrypted JSON
      } else {
        const loginData = JSON.parse(atob(params[2])) as WalletDataFromMagicLink
        yield put(actions.auth.setMagicLinkInfo(loginData))
        yield put(actions.auth.setMagicLinkInfoEncoded(params[2]))
        yield call(parseMagicLink)
      }
      yield put(actions.auth.initializeLoginSuccess())
      yield put(actions.auth.pingManifestFile())
    } catch (e) {
      yield put(actions.auth.initializeLoginFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'initializeLogin', e))
    }
  }

  // triggers verification email for login
  const triggerWalletMagicLink = function* (action) {
    const formValues = yield select(selectors.form.getFormValues('login'))
    const { step } = formValues
    const shouldPollForMagicLinkData = (yield select(
      selectors.core.walletOptions.getPollForMagicLinkData
    )).getOrElse(false)
    yield put(startSubmit('login'))
    try {
      yield put(actions.auth.triggerWalletMagicLinkLoading())
      const sessionToken = yield call(api.obtainSessionToken)
      const { captchaToken, email } = action.payload
      yield put(actions.session.saveSession(assoc(email, sessionToken, {})))
      yield call(api.triggerWalletMagicLink, email, captchaToken, sessionToken)
      if (step === LoginSteps.CHECK_EMAIL) {
        yield put(actions.alerts.displayInfo(C.VERIFY_EMAIL_SENT))
      } else {
        yield put(actions.form.change('login', 'step', LoginSteps.CHECK_EMAIL))
      }
      // polling feature flag
      if (shouldPollForMagicLinkData) {
        yield call(pollingForMagicLinkDataSession, sessionToken)
      }
      yield put(actions.auth.triggerWalletMagicLinkSuccess())
    } catch (e) {
      yield put(actions.auth.triggerWalletMagicLinkFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'triggerWalletMagicLink', e))
      yield put(actions.alerts.displayError(C.VERIFY_EMAIL_SENT_ERROR))
    } finally {
      yield put(stopSubmit('login'))
    }
  }

  const authorizeVerifyDevice = function* (action) {
    const confirmDevice = action.payload
    const { wallet } = yield select(selectors.auth.getMagicLinkData)
    const magicLinkDataEncoded = yield select(selectors.auth.getMagicLinkDataEncoded)
    try {
      yield put(actions.auth.authorizeVerifyDeviceLoading())
      const data = yield call(
        api.authorizeVerifyDevice,
        wallet.session_id,
        magicLinkDataEncoded,
        confirmDevice
      )
      if (data.success) {
        yield put(actions.auth.authorizeVerifyDeviceSuccess({ deviceAuthorized: true }))
        yield put(actions.auth.analyticsAuthorizeVerifyDeviceSuccess())
      }
    } catch (e) {
      if (e.status === 401 && e.confirmation_required) {
        yield put(actions.auth.authorizeVerifyDeviceSuccess(e))
      } else if (e.status === 409) {
        yield put(actions.auth.authorizeVerifyDeviceFailure(e))
        yield put(actions.auth.analyticsAuthorizeVerifyDeviceFailure('REJECTED'))
      } else if (e.status === 400 && e.link_expired) {
        yield put(actions.auth.authorizeVerifyDeviceFailure(e))
        yield put(actions.auth.analyticsAuthorizeVerifyDeviceFailure('EXPIRED'))
      } else {
        yield put(actions.auth.authorizeVerifyDeviceFailure(e.error))
        yield put(actions.auth.analyticsAuthorizeVerifyDeviceFailure('UNKNOWN'))
      }
    }
  }

  const getUserGeoLocation = function* () {
    try {
      const userLocationData = yield call(api.getLocation)
      yield put(actions.auth.setUserGeoLocation(userLocationData))
    } catch (e) {
      // todo
    }
  }

  const resetAccount = function* (action) {
    // if user is resetting their custodial account
    // create a new wallet and assign an existing custodial account to that wallet
    yield put(actions.auth.resetAccountLoading())
    try {
      const { email, language, password } = action.payload
      // get recovery token and nabu ID
      const magicLinkData: WalletDataFromMagicLink = yield select(S.getMagicLinkData)
      const recoveryToken = magicLinkData.wallet?.nabu?.recovery_token
      const userId = magicLinkData.wallet?.nabu?.user_id
      yield put(actions.auth.setResetAccount(true))
      // create a new wallet
      yield call(register, actions.auth.register({ email, language, password }))
      const guid = yield select(selectors.core.wallet.getGuid)
      // generate a retail token for new wallet
      const retailToken = yield call(generateRetailToken)
      // call the reset nabu user endpoint, receive new lifetime token for nabu user
      const { token: lifetimeToken } = yield call(
        api.resetUserAccount,
        userId,
        recoveryToken,
        retailToken
      )
      // set new lifetime token for user in metadata
      yield put(actions.core.kvStore.userCredentials.setUserCredentials(userId, lifetimeToken))
      // fetch user in new wallet
      yield call(setSession, userId, lifetimeToken, email, guid)
      yield put(actions.auth.resetAccountSuccess())
    } catch (e) {
      yield put(actions.auth.resetAccountFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'resetAccount', e))
      yield put(actions.modals.showModal('RESET_ACCOUNT_FAILED', { origin: 'ResetAccount' }))
    }
  }
  return {
    authNabu,
    authorizeVerifyDevice,
    getUserGeoLocation,
    initializeLogin,
    login,
    loginRoutineSaga,
    mobileLogin,
    pingManifestFile,
    pollingForMagicLinkDataSession,
    pollingSession,
    register,
    resendSmsLoginCode,
    resetAccount,
    restore,
    restoreFromMetadata,
    saveGoals,
    startSockets,
    triggerWalletMagicLink
  }
}
