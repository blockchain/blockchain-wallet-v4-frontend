import { select } from 'redux-saga/effects'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { fork, call } from 'redux-saga-test-plan/matchers'

import { askSecondPasswordEnhancer, confirm } from 'services/SagaService'
import { coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'
import * as selectors from '../selectors'
import * as actions from '../actions'
import authSagas, {
  defaultLoginErrorMessage,
  logLocation,
  wrongWalletPassErrorMessage,
  wrongAuthCodeErrorMessage,
  guidNotFound2faErrorMessage,
  notEnabled2faErrorMessage,
  emailMismatch2faErrorMessage,
  wrongCaptcha2faErrorMessage
} from './sagas'
import * as C from 'services/AlertService'

jest.mock('blockchain-wallet-v4/src/redux/sagas')
const coreSagas = coreSagasFactory({ api: {} })
const api = {
  obtainSessionToken: jest.fn(),
  deauthorizeBrowser: jest.fn()
}

const VULNERABLE_ADDRESS = '1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH'

describe('authSagas', () => {
  // Mocking Math.random() to have identical popup ids for action testing
  const originalMath = Object.create(Math)
  let pushStateSpy
  let locationReloadSpy
  beforeAll(() => {
    Math.random = () => 0.5
    pushStateSpy = jest
      .spyOn(window.history, 'pushState')
      .mockImplementation(() => {})
    locationReloadSpy = jest
      .spyOn(window.location, 'reload')
      .mockImplementation(() => {})
  })
  afterAll(() => {
    global.Math = originalMath
    pushStateSpy.restore()
    locationReloadSpy.restore()
  })

  describe('login flow', () => {
    const { login, pollingSession } = authSagas({
      api,
      coreSagas
    })
    const guid = '123abc456def'
    const password = 'blockchain'
    const sessionIdStub = 'id'
    const payload = {
      guid,
      password,
      code: undefined,
      sharedKey: undefined,
      mobileLogin: undefined
    }
    const saga = testSaga(login, { payload })

    it('should select session', () => {
      saga.next().select(selectors.session.getSession, guid)
    })

    it('should call obtainSessionToken if session was not selected', () => {
      saga.next().call(api.obtainSessionToken)
    })

    it('should put saveSession', () => {
      saga
        .next(sessionIdStub)
        .put(actions.session.saveSession({ [guid]: sessionIdStub }))
    })

    it('should cache guid', () => {
      saga.next().put(actions.auth.loginLoading())
    })

    it('should fetch wallet', () => {
      const { guid, password, code, sharedKey } = payload
      saga.next().call(coreSagas.wallet.fetchWalletSaga, {
        guid,
        password,
        code,
        sharedKey,
        session: sessionIdStub
      })
    })

    it('should put login routine', () => {
      const { mobileLogin } = payload
      saga
        .next()
        .put(actions.auth.loginRoutine(mobileLogin))
        .next()
        .isDone()
    })

    it('should not call obtainSessionToken if session was selected and use selected session in further calls', () => {
      const { guid, password, code, sharedKey } = payload
      return expectSaga(login, { payload })
        .provide([[select(selectors.session.getSession, guid), sessionIdStub]])
        .not.call(api.obtainSessionToken)
        .put(actions.session.saveSession({ [guid]: sessionIdStub }))
        .call(coreSagas.wallet.fetchWalletSaga, {
          guid,
          password,
          code,
          sharedKey,
          session: sessionIdStub
        })
        .run()
    })

    describe('error handling', () => {
      const beforeError = 'beforeError'
      beforeAll(() => {
        saga.restart()
        // Pass through steps before error
        saga
          .next()
          .next()
          .next(sessionIdStub)
          .next(guid)
          .next()
          .save(beforeError)
      })

      describe('authorization error flow', () => {
        const beforeAuth = 'beforeAuth'
        beforeAll(() => {
          saga.restore(beforeError).save(beforeError)
        })

        it('should display info that authorization is required', () => {
          const message = 'error'
          saga
            .throw({ authorization_required: message })
            .put(
              actions.alerts.displayInfo(
                C.AUTHORIZATION_REQUIRED_INFO,
                undefined,
                true
              )
            )
        })

        it('should poll for session', () => {
          saga
            .next({ payload: { id: 'id' } })
            .call(pollingSession, sessionIdStub)
            .save(beforeAuth)
        })

        it('should dismiss auth required alert', () => {
          saga.next().put(actions.alerts.dismissAlert('id'))
        })

        it('should show session error if not authorized', () => {
          saga
            .next()
            .put(actions.alerts.displayError(C.WALLET_SESSION_ERROR))
            .next()
            .isDone()
        })

        describe('authorized flow', () => {
          const before2FAError = 'before2FAError'

          it('should fetch wallet', () => {
            saga
              .restore(beforeAuth)
              .next(true)
              .next()
              .call(coreSagas.wallet.fetchWalletSaga, {
                guid,
                password,
                session: sessionIdStub
              })
          })

          it('should put login routine', () => {
            const { mobileLogin } = payload
            saga.next().put(actions.auth.loginRoutine(mobileLogin))
          })

          it('should follow 2FA flow on auth error', () => {
            const authType = 1
            saga
              .save(before2FAError)
              .throw({ auth_type: authType })
              .put(actions.auth.setAuthType(authType))
              .next()
              .put(actions.alerts.displayInfo(C.TWOFA_REQUIRED_INFO))
              .next()
              .put(actions.auth.loginFailure())
              .next()
              .isDone()
          })

          it('should show wrong password message & log on other errors', () => {
            const error = null

            saga
              .restore(before2FAError)
              .throw(error)
              .put(actions.auth.loginFailure(wrongWalletPassErrorMessage))
              .next()
              .put(actions.logs.logErrorMessage(logLocation, 'login', error))
              .next()
              .isDone()
          })
        })
      })

      describe('initial error', () => {
        beforeAll(() => {
          saga.restore(beforeError).save(beforeError)
        })

        it('should trigger login failure', () => {
          const message = 'error'
          saga
            .throw({ initial_error: message })
            .put(actions.auth.loginFailure(message))
            .next()
            .isDone()
        })
      })

      describe('2FA errros', () => {
        const authType = 1
        beforeAll(() => {
          saga.restore(beforeError).save(beforeError)
        })

        it('should trigger login failure', () => {
          saga.throw({ auth_type: authType }).put(actions.auth.loginFailure())
        })

        it('should set authType to one provided by error', () => {
          saga.next().put(actions.auth.setAuthType(authType))
        })

        it('should display 2fa required info', () => {
          saga
            .next()
            .put(actions.alerts.displayInfo(C.TWOFA_REQUIRED_INFO))
            .next()
            .isDone()
        })
      })

      describe('wrong password error', () => {
        it('should set auth_type to 0, removing 2fa code field', () => {
          saga
            .restore(beforeError)
            .save(beforeError)
            .throw(wrongWalletPassErrorMessage)
            .put(actions.auth.setAuthType(0))
        })

        it('should clear password and code field', () => {
          saga
            .next()
            .put(
              actions.form.clearFields('login', false, true, 'password', 'code')
            )
        })

        it('should focus password', () => {
          saga.next().put(actions.form.focus('login', 'password'))
        })

        it('should display login error', () => {
          saga
            .next()
            .put(actions.auth.loginFailure(wrongWalletPassErrorMessage))
        })
      })

      describe('wrong 2fa error', () => {
        it('should clear code field', () => {
          saga
            .restore(beforeError)
            .save(beforeError)
            .throw(wrongAuthCodeErrorMessage)
            .put(actions.form.clearFields('login', false, true, 'code'))
        })

        it('should focus password', () => {
          saga.next().put(actions.form.focus('login', 'code'))
        })

        it('should display login error', () => {
          saga.next().put(actions.auth.loginFailure(wrongAuthCodeErrorMessage))
        })
      })

      describe('unknown errros', () => {
        const errorMessage = 'error'
        beforeEach(() => {
          saga.restore(beforeError).save(beforeError)
        })

        it('should put loginFailure action with message when error hash it', () => {
          saga
            .throw({ message: errorMessage })
            .put(actions.auth.loginFailure(errorMessage))
        })

        it('should put loginFailure action with error when error is a string', () => {
          saga
            .throw(errorMessage)
            .put(actions.auth.loginFailure(errorMessage))
            .next()
            .isDone()
        })

        it('should put loginFailure action with default error message', () => {
          saga
            .throw(null)
            .put(actions.auth.loginFailure(defaultLoginErrorMessage))
            .next()
            .isDone()
        })
      })
    })
  })

  describe('login routine', () => {
    const {
      authNabu,
      checkDataErrors,
      loginRoutineSaga,
      logoutRoutine,
      saveGoals,
      setLogoutEventListener,
      startSockets,
      transferEthSaga,
      upgradeWalletSaga,
      upgradeAddressLabelsSaga
    } = authSagas({
      api,
      coreSagas
    })
    const mobileLogin = true
    const firstLogin = false

    const saga = testSaga(loginRoutineSaga, {
      payload: { mobileLogin, firstLogin }
    })

    const beforeHdCheck = 'beforeHdCheck'

    it('should check if wallet is an hd wallet', () => {
      saga
        .next()
        .select(selectors.core.wallet.isHdWallet)
        .save(beforeHdCheck)
    })

    it('should call upgradeWalletSaga if wallet is not hd', () => {
      saga
        .next(false)
        .call(upgradeWalletSaga)
        .restore(beforeHdCheck)
    })

    it('should fetch root', () => {
      saga
        .next(true)
        .call(coreSagas.kvStore.root.fetchRoot, askSecondPasswordEnhancer)
    })

    it('should fetch eth metadata', () => {
      saga
        .next()
        .call(coreSagas.kvStore.eth.fetchMetadataEth, askSecondPasswordEnhancer)
    })

    it('should fetch xlm metadata', () => {
      saga
        .next()
        .call(coreSagas.kvStore.xlm.fetchMetadataXlm, askSecondPasswordEnhancer)
    })

    it('should fetch bch metadata', () => {
      saga.next().call(coreSagas.kvStore.bch.fetchMetadataBch)
    })

    it('should fetch lockbox metadata', () => {
      saga.next().call(coreSagas.kvStore.lockbox.fetchMetadataLockbox)
    })

    it('should redirect to home route', () => {
      saga.next().put(actions.router.push('/home'))
    })

    it('should fetch settings', () => {
      saga.next().call(coreSagas.settings.fetchSettings)
    })

    it('should fetch xlm ledger details', () => {
      saga.next().call(coreSagas.data.xlm.fetchLedgerDetails)
    })

    it('should fetch xlm accounts', () => {
      saga.next().call(coreSagas.data.xlm.fetchData)
    })

    it('should call auth nabu saga', () => {
      saga.next().call(authNabu)
    })

    it('should call upgrade address labels saga', () => {
      saga.next().call(upgradeAddressLabelsSaga)
    })

    it('should trigger login success action', () => {
      saga.next().put(actions.auth.loginSuccess())
    })

    it('should start logout timer', () => {
      saga.next().put(actions.auth.startLogoutTimer())
    })

    it('should start sockets', () => {
      saga.next().call(startSockets)
    })

    it('should select guid from state', () => {
      saga.next().select(selectors.core.wallet.getGuid)
    })

    it('should cache guid', () => {
      const guid = 'guid'
      saga.next(guid).put(actions.cache.guidEntered(guid))
    })

    it('should select current language', () => {
      saga.next().select(selectors.preferences.getLanguage)
    })

    it('should trigger update language action with selected language', () => {
      const language = 'en'
      saga.next(language).put(actions.modules.settings.updateLanguage(language))
    })

    it('should init analytics user session', () => {
      saga.next().put(actions.analytics.initUserSession())
    })

    it('should launch transferEth saga', () => {
      saga.next().fork(transferEthSaga)
    })

    it('should save goals', () => {
      saga.next().call(saveGoals, false)
    })

    it('should run goals', () => {
      saga.next().put(actions.goals.runGoals())
    })

    it('should check for data errors', () => {
      saga.next().fork(checkDataErrors)
    })

    it('should start listening for logout event', () => {
      saga.next().call(setLogoutEventListener)
    })

    it('should launch logout routine saga upon logout event', () => {
      const stubLogoutEvent = {}
      saga.next(stubLogoutEvent).fork(logoutRoutine, stubLogoutEvent)
    })

    it("should not display success if it's first login", () => {
      const firstLogin = true

      return expectSaga(loginRoutineSaga, {
        payload: { mobileLogin, firstLogin }
      })
        .provide([
          // Every async or value returning yield has to be mocked
          // for saga to progress
          [select(selectors.core.wallet.isHdWallet), true],
          [select(selectors.core.wallet.getGuid), 12],
          [fork.fn(transferEthSaga), jest.fn],
          [call.fn(setLogoutEventListener), jest.fn],
          [fork.fn(logoutRoutine), jest.fn]
        ])
        .not.put(actions.alerts.displaySuccess(C.LOGIN_SUCCESS))
        .run()
    })

    describe('error handling', () => {
      it('should log error', () => {
        const error = {}
        saga
          .throw(error)
          .put(
            actions.logs.logErrorMessage(logLocation, 'loginRoutineSaga', error)
          )
      })

      it('should show wallet error alert', () => {
        saga
          .next()
          .put(actions.alerts.displayError(C.WALLET_LOADING_ERROR))
          .next()
          .isDone()
      })
    })
  })

  describe('register flow', () => {
    const { register } = authSagas({
      api,
      coreSagas
    })
    const email = 'stub@mail.com'
    const password = 'password'
    const language = 'en'
    const payload = { email, password, language }

    const saga = testSaga(register, { payload })

    it('should set state to restore loading', () => {
      saga.next().put(actions.auth.registerLoading())
    })

    it('should pass payload to restoreWallet core saga', () => {
      saga.next().call(coreSagas.wallet.createWalletSaga, payload)
    })

    it('should display restore success alert', () => {
      saga.next().put(actions.alerts.displaySuccess(C.REGISTER_SUCCESS))
    })

    it('should put login routine action with falsy mobileLogin and truthy firstLogin', () => {
      const mobileLogin = false
      const firstLogin = true
      saga.next().put(actions.auth.loginRoutine(mobileLogin, firstLogin))
    })

    it('should finally trigger action that restore is successful', () => {
      const beforeEnd = 'beforeEnd'
      saga
        .next()
        .put(actions.auth.registerSuccess())
        .save(beforeEnd)
        .next()
        .isDone()
        .restore(beforeEnd)
    })

    describe('error handling', () => {
      const error = {}
      it('should trigger action that restore failed', () => {
        saga.throw(error).put(actions.auth.registerFailure())
      })

      it('should log restore error', () => {
        saga
          .next()
          .put(actions.logs.logErrorMessage(logLocation, 'register', error))
      })

      it('should show restore error alert', () => {
        saga.next().put(actions.alerts.displayError(C.REGISTER_ERROR))
      })
    })
  })

  describe('restore flow', () => {
    const { restore } = authSagas({
      api,
      coreSagas
    })
    const mnemonic = '1 2 3 4 5 6 7 8 9 10 11 12'
    const email = 'stub@mail.com'
    const password = 'password'
    const language = 'en'
    const network = 'testnet'
    const payload = { mnemonic, email, password, language, network }

    const saga = testSaga(restore, { payload })

    it('should set state to restore loading', () => {
      saga.next().put(actions.auth.restoreLoading())
    })

    it('should display restore wallet information alert', () => {
      saga.next().put(actions.alerts.displayInfo(C.RESTORE_WALLET_INFO))
    })

    it('should pass payload to restoreWallet core saga', () => {
      saga.next().call(coreSagas.wallet.restoreWalletSaga, payload)
    })

    it('should display restore success alert', () => {
      saga.next().put(actions.alerts.displaySuccess(C.RESTORE_SUCCESS))
    })

    it('should put login routine action with falsy mobileLogin and truthy firstLogin', () => {
      const mobileLogin = false
      const firstLogin = true
      saga.next().put(actions.auth.loginRoutine(mobileLogin, firstLogin))
    })

    it('should finally trigger action that restore is successful', () => {
      const beforeEnd = 'beforeEnd'
      saga
        .next()
        .put(actions.auth.restoreSuccess())
        .save(beforeEnd)
        .next()
        .isDone()
        .restore(beforeEnd)
    })

    describe('error handling', () => {
      const error = {}
      it('should trigger action that restore failed', () => {
        saga.throw(error).put(actions.auth.restoreFailure())
      })

      it('should log restore error', () => {
        saga
          .next()
          .put(actions.logs.logErrorMessage(logLocation, 'restore', error))
      })

      it('should show restore error alert', () => {
        saga.next().put(actions.alerts.displayError(C.RESTORE_ERROR))
      })
    })
  })

  describe('reset 2fa flow', () => {
    const { reset2fa } = authSagas({
      api,
      coreSagas
    })
    const guid = 'guid'
    const email = 'stub@mail.com'
    const newEmail = 'new@mail.com'
    const secretPhrase = '1 2 3 4 5 6 7 8 9 10 11 12'
    const message = 'message'
    const code = 'code'
    const sessionToken = 'sessionToken'
    const payload = {
      guid,
      email,
      newEmail,
      secretPhrase,
      message,
      code,
      sessionToken
    }

    const saga = testSaga(reset2fa, { payload })
    const beforeResponse = 'beforeResponse'

    it('should trigger reset 2fa action', () => {
      saga.next().put(actions.auth.reset2faLoading())
    })

    it('should pass payload to core resetWallet2fa saga', () => {
      saga
        .next()
        .call(coreSagas.wallet.resetWallet2fa, payload)
        .save(beforeResponse)
    })

    it('should trigger reset 2fa success action if response is successsul', () => {
      const response = {
        success: true
      }
      saga.next(response).put(actions.auth.reset2faSuccess())
    })

    it('should display reset 2a success alert if response is successsul', () => {
      saga
        .next()
        .put(actions.alerts.displayInfo(C.RESET_TWOFA_INFO))
        .next()
        .isDone()
    })

    it('should throw an error if response is not successful', () => {
      const response = {
        success: false
      }
      saga
        .restore(beforeResponse)
        .next(response)
        // First yield in catch block
        .put(actions.core.data.misc.fetchCaptcha())
    })

    describe('error handling', () => {
      const error = {}

      it('should trigger fetch capcha action', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(actions.core.data.misc.fetchCaptcha())
      })

      it('should trigger reset2fa failure action', () => {
        saga.next().put(actions.auth.reset2faFailure())
      })

      it('should log error', () => {
        saga
          .next()
          .put(actions.logs.logErrorMessage(logLocation, 'reset2fa', error))
      })

      it('should display guid not found error', () => {
        const guidNotFound2faError = {
          toString: () => guidNotFound2faErrorMessage
        }
        return expectSaga(reset2fa, { payload })
          .provide({
            call (effect, next) {
              if (effect.fn === coreSagas.wallet.resetWallet2fa) {
                throw guidNotFound2faError
              }

              return next()
            }
          })
          .put(actions.alerts.displayError(C.TWOFA_RESET_UNKNOWN_GUID_ERROR))
          .run()
      })

      it('should display 2fa not enabled error and redirect to /login', () => {
        const notEnabled2faResponse = {
          message: notEnabled2faErrorMessage.replace(/^Error: /, '')
        }
        return expectSaga(reset2fa, { payload })
          .provide([
            [call.fn(coreSagas.wallet.resetWallet2fa), notEnabled2faResponse]
          ])
          .put(actions.router.push('/login'))
          .put(actions.alerts.displayError(C.TWOFA_RESET_NOT_ENABLED_ERROR))
          .run()
      })

      it('should display 2fa email reset error', () => {
        const emailMismatch2faResponse = {
          message: emailMismatch2faErrorMessage.replace(/^Error: /, '')
        }
        expectSaga(reset2fa, { payload })
          .provide([
            [call.fn(coreSagas.wallet.resetWallet2fa), emailMismatch2faResponse]
          ])
          .put(actions.alerts.displayError(C.TWOFA_RESET_EMAIL_ERROR))
          .run()
      })

      it('should display wrong captcha 2fa email', () => {
        const wrongCaptcha2faResponse = {
          message: wrongCaptcha2faErrorMessage.replace(/^Error: /, '')
        }
        expectSaga(reset2fa, { payload })
          .provide([
            [call.fn(coreSagas.wallet.resetWallet2fa), wrongCaptcha2faResponse]
          ])
          .put(actions.alerts.displayError(C.CAPTCHA_CODE_INCORRECT))
          .run()
      })

      it('should display wrong captcha 2fa reset error', () => {
        const otherErrorResponse = {
          message: ''
        }
        expectSaga(reset2fa, { payload })
          .provide([
            [call.fn(coreSagas.wallet.resetWallet2fa), otherErrorResponse]
          ])
          .put(actions.alerts.displayError(C.TWOFA_RESET_ERROR))
          .run()
      })
    })
  })

  describe('resend sms login code flow', () => {
    const { resendSmsLoginCode } = authSagas({
      api,
      coreSagas
    })
    const guid = 'guid'
    const payload = { guid }

    const saga = testSaga(resendSmsLoginCode, { payload })
    const beforeResponse = 'beforeResponse'

    it('should select session token by guid from session', () => {
      saga.next().select(selectors.session.getSession, guid)
    })

    it('should call resendSmsLoginCode core saga with guid and session token', () => {
      const sessionToken = 'sessionToken'
      saga
        .next(sessionToken)
        .call(coreSagas.wallet.resendSmsLoginCode, { guid, sessionToken })
    })

    it("should throw upon initial_error response and it doesn't include login attempts left", () => {
      const initialErrorResponse = {
        initial_error: '123'
      }
      saga
        .save(beforeResponse)
        .next(initialErrorResponse)
        // Initial error handling step
        .put(
          actions.logs.logErrorMessage(
            logLocation,
            'resendSmsLoginCode',
            new Error(initialErrorResponse)
          )
        )
    })

    it('should display success if response has no error', () => {
      const response = {}
      saga
        .restore(beforeResponse)
        .save(beforeResponse)
        .next(response)
        .put(actions.alerts.displaySuccess(C.SMS_RESEND_SUCCESS))
        .next()
        .isDone()
    })

    it('should display success if initial_error includes login attempts left message', () => {
      const initialErrorResponse = {
        initial_error: '10 login attempts left'
      }
      saga
        .restore(beforeResponse)
        .save(beforeResponse)
        .next(initialErrorResponse)
        .put(actions.alerts.displaySuccess(C.SMS_RESEND_SUCCESS))
        .next()
        .isDone()
    })

    describe('error handling', () => {
      it('should log resend sms login code error message', () => {
        const error = {}
        saga
          .restore(beforeResponse)
          .throw(error)
          .put(
            actions.logs.logErrorMessage(
              logLocation,
              'resendSmsLoginCode',
              error
            )
          )
      })

      it('should display sms login code error alert', () => {
        saga
          .next()
          .put(actions.alerts.displayError(C.SMS_RESEND_ERROR))
          .next()
          .isDone()
      })
    })
  })

  describe('remind guid flow', () => {
    const { remindGuid } = authSagas({
      api,
      coreSagas
    })
    const email = 'stub@mail.com'
    const code = '1324'
    const sessionToken = 'sessionToken'
    const payload = { email, code, sessionToken }

    const saga = testSaga(remindGuid, { payload })

    it('should trigger a remind guid loading action', () => {
      saga.next().put(actions.auth.remindGuidLoading())
    })

    it('should pass payload to core remindWalletGuidSaga', () => {
      saga.next().call(coreSagas.wallet.remindWalletGuidSaga, payload)
    })

    it('should show successful guid send alert', () => {
      saga.next().put(actions.alerts.displaySuccess(C.GUID_SENT_SUCCESS))
    })

    it('should put remind guid success action', () => {
      saga
        .next()
        .put(actions.auth.remindGuidSuccess())
        .next()
        .isDone()
    })

    describe('error handling', () => {
      describe('Other errors', () => {
        const error = {}
        beforeAll(() => {
          saga.restart().next()
        })

        it('trigger remind guid failure action', () => {
          saga.throw(error).put(actions.auth.remindGuidFailure())
        })

        it('should log an error message', () => {
          saga
            .next()
            .put(actions.logs.logErrorMessage(logLocation, 'remindGuid', error))
        })

        it('should display error alert', () => {
          saga
            .next()
            .put(actions.alerts.displayError(C.GUID_SENT_ERROR))
            .next()
            .isDone()
        })
      })

      describe('Captcha error', () => {
        const captchaError = {
          message: 'Captcha Code Incorrect'
        }
        beforeAll(() => {
          saga.restart().next()
        })

        it('trigger remind guid failure action', () => {
          saga.throw(captchaError).put(actions.auth.remindGuidFailure())
        })

        it('should log an error message', () => {
          saga
            .next()
            .put(
              actions.logs.logErrorMessage(
                logLocation,
                'remindGuid',
                captchaError
              )
            )
        })

        it('should refetch captcha in case of incorrect captcha', () => {
          saga.next().put(actions.core.data.misc.fetchCaptcha())
        })

        it('should show incorrect captcha alert', () => {
          saga
            .next()
            .put(actions.alerts.displayError(C.CAPTCHA_CODE_INCORRECT))
            .next()
            .isDone()
        })
      })
    })
  })

  describe('logout routine', () => {
    const { logout } = authSagas({
      api,
      coreSagas
    })

    it('should stop rates scoket if user flow is supported', () => {
      return expectSaga(logout)
        .provide([
          [select(selectors.core.settings.getEmailVerified), Remote.of(true)],
          [select(selectors.modules.profile.userFlowSupported), Remote.of(true)]
        ])
        .put(actions.modules.profile.clearSession())
        .put(actions.middleware.webSocket.rates.stopSocket())
        .run()
    })

    it('should not stop rates scoket if user flow is supported', () => {
      return expectSaga(logout)
        .provide([
          [select(selectors.core.settings.getEmailVerified), Remote.of(true)],
          [
            select(selectors.modules.profile.userFlowSupported),
            Remote.of(false)
          ]
        ])
        .not.put(actions.modules.profile.clearSession())
        .not.put(actions.middleware.webSocket.rates.stopSocket())
        .run()
    })

    it('should stop sockets and redirect to logout if email is verified', () => {
      return expectSaga(logout)
        .provide([
          [select(selectors.core.settings.getEmailVerified), Remote.of(true)],
          [
            select(selectors.modules.profile.userFlowSupported),
            Remote.of(false)
          ]
        ])
        .put(actions.middleware.webSocket.bch.stopSocket())
        .put(actions.middleware.webSocket.btc.stopSocket())
        .put(actions.middleware.webSocket.eth.stopSocket())
        .put(actions.middleware.webSocket.xlm.stopStreams())
        .put(actions.router.push('/logout'))
        .run()
    })

    it('should stop sockets and clear redux store if email is not verified', async () => {
      return expectSaga(logout)
        .provide([
          [select(selectors.core.settings.getEmailVerified), Remote.of(false)],
          [
            select(selectors.modules.profile.userFlowSupported),
            Remote.of(false)
          ]
        ])
        .put(actions.middleware.webSocket.bch.stopSocket())
        .put(actions.middleware.webSocket.btc.stopSocket())
        .put(actions.middleware.webSocket.eth.stopSocket())
        .put(actions.middleware.webSocket.xlm.stopStreams())
        .run()
        .then(() => {
          expect(pushStateSpy).toHaveBeenCalledTimes(1)
          expect(pushStateSpy).toHaveBeenCalledWith('', '', '#')
        })
    })
  })

  describe('deauthorization of browser', () => {
    const { deauthorizeBrowser } = authSagas({
      api,
      coreSagas
    })
    const saga = testSaga(deauthorizeBrowser)
    const beforeCatch = 'beforeCatch'

    const pageReloadTest = () =>
      it('should push login to url to history and reload window', () => {
        pushStateSpy.mockReset()
        locationReloadSpy.mockReset()

        saga
          .next()
          .inspect(gen => {
            // Inside the called saga
            gen.next()
            expect(pushStateSpy).toHaveBeenCalledTimes(1)
            expect(pushStateSpy).toHaveBeenCalledWith('', '', '#')

            gen.next()
            expect(locationReloadSpy).toHaveBeenCalledTimes(1)
            expect(locationReloadSpy).toHaveBeenCalledWith(true)
          })
          .next()
          .isDone()
      })

    it('should select guid', () => {
      saga.next().select(selectors.core.wallet.getGuid)
    })

    it('should get session token by guid', () => {
      const guid = 'guid'
      saga.next(guid).select(selectors.session.getSession, guid)
    })

    it('should call deauthorize browser api with session token', () => {
      const sessionToken = 'sessionToken'
      saga.next(sessionToken).call(api.deauthorizeBrowser, sessionToken)
    })

    it('should show success alert', () => {
      saga
        .next()
        .put(actions.alerts.displaySuccess(C.DEAUTHORIZE_BROWSER_SUCCESS))
        .save(beforeCatch)
    })

    pageReloadTest()

    describe('error handling', () => {
      beforeAll(() => {
        saga.restore(beforeCatch)
      })

      it('should log error', () => {
        const error = {}
        saga
          .throw(error)
          .put(
            actions.logs.logErrorMessage(
              logLocation,
              'deauthorizeBrowser',
              error
            )
          )
      })

      it('should show error alert', () => {
        saga
          .next()
          .put(actions.alerts.displayError(C.DEAUTHORIZE_BROWSER_ERROR))
      })

      pageReloadTest()
    })
  })

  const VULNERABLE_ADDRESS_ERROR = `A security issue effects address ${VULNERABLE_ADDRESS}. Please Archive It and Contact support@blockchain.zendesk.com`
  describe('checkDataErrors', () => {
    const { checkDataErrors } = authSagas({ api, coreSagas })
    const saga = testSaga(checkDataErrors)
    it('should select btc getInfo', () => {
      saga.next().select(selectors.core.data.btc.getInfo)
    })
  })

  describe('checkAndHandleVulnerableAddress', () => {
    const { checkAndHandleVulnerableAddress } = authSagas({ api, coreSagas })
    const data = { error: VULNERABLE_ADDRESS_ERROR }
    const saga = testSaga(checkAndHandleVulnerableAddress, data)

    it('should close all modals', () => {
      saga.next().put(actions.modals.closeAllModals())
    })

    it('should call confirm', () => {
      saga.next().call(confirm, {
        title: 'archive_vulnerable_address_title',
        message: 'archive_vulnerable_address_msg',
        confirm: 'archive_vulnerable_address_confirm',
        cancel: 'archive_vulnerable_address_cancel',
        messageValues: { vulnerableAddress: VULNERABLE_ADDRESS }
      })
    })
    it('should archive the address', () => {
      saga
        .next(true)
        .put(actions.core.wallet.setAddressArchived(VULNERABLE_ADDRESS, true))
    })
  })
})
