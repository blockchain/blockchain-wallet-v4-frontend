import { select } from 'redux-saga/effects'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { fork, call } from 'redux-saga-test-plan/matchers'

import { askSecondPasswordEnhancer } from 'services/SagaService'
import { coreSagasFactory } from 'blockchain-wallet-v4/src'
import * as selectors from '../selectors.js'
import * as actions from '../actions.js'
import authSagas, {
  defaultLoginErrorMessage,
  logLocation,
  wrongWalletPassErrorMessage
} from './sagas'
import * as C from 'services/AlertService'

jest.mock('blockchain-wallet-v4/src/redux/sagas')
const coreSagas = coreSagasFactory()
const api = {
  obtainSessionToken: jest.fn(),
  deauthorizeBrowser: jest.fn()
}

describe('authSagas', () => {
  // Mocking Math.random() to have identical popup ids for action testing
  const originalMath = Object.create(Math)
  beforeAll(() => {
    Math.random = () => 0.5
  })
  afterAll(() => {
    global.Math = originalMath
  })

  describe('login flow', () => {
    const { login, loginRoutineSaga, pollingSession } = authSagas({
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

    it('should call login routine', () => {
      const { mobileLogin } = payload
      saga
        .next()
        .call(loginRoutineSaga, mobileLogin)
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
            .throw(JSON.stringify({ authorization_required: message }))
            .put(actions.alerts.displayInfo(C.AUTHORIZATION_REQUIRED_INFO))
        })

        it('should poll for session', () => {
          saga
            .next()
            .call(pollingSession, sessionIdStub)
            .save(beforeAuth)
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
              .call(coreSagas.wallet.fetchWalletSaga, {
                guid,
                password,
                session: sessionIdStub
              })
          })

          it('should call logine routine', () => {
            const { mobileLogin } = payload
            saga.next().call(loginRoutineSaga, mobileLogin)
          })

          it('should follow 2FA low on auth error', () => {
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
            .throw(JSON.stringify({ initial_error: message }))
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
      loginRoutineSaga,
      logoutRoutine,
      reportStats,
      setLogoutEventListener,
      transferEthSaga,
      upgradeWalletSaga,
      welcomeSaga
    } = authSagas({
      api,
      coreSagas
    })
    const mobileLogin = true
    const firstLogin = false
    const saga = testSaga(loginRoutineSaga, mobileLogin, firstLogin)
    const beforeHdCheck = 'beforeHdCheck'

    it('should check if wallet is an hd wallet', () => {
      saga.next().select(selectors.core.wallet.isHdWallet).save(beforeHdCheck)
    })

    it('should call upgradeWalletSaga if wallet is not hd', () => {
      saga.next(false).call(upgradeWalletSaga).restore(beforeHdCheck)
    })

    it('should put authenticate action', () => {
      saga.next(true).put(actions.auth.authenticate())
    })

    it('should put action to start bitcoin socket', () => {
      saga.next().put(actions.core.webSocket.bitcoin.startSocket())
    })

    it('should put action to start ethereum socket', () => {
      saga.next().put(actions.core.webSocket.ethereum.startSocket())
    })

    it('should put action to start bitcoin cash socket', () => {
      saga.next().put(actions.core.webSocket.bch.startSocket())
    })

    it('should fetch root', () => {
      saga.next().call(coreSagas.kvStore.root.fetchRoot, askSecondPasswordEnhancer)
    })

    it('should fetch ethereum metadata', () => {
      saga.next().call(coreSagas.kvStore.ethereum.fetchMetadataEthereum)
    })

    it('should fetch bitcoin cash metadata', () => {
      saga.next().call(coreSagas.kvStore.bch.fetchMetadataBch)
    })

    it('should redirect to home route', () => {
      saga.next().put(actions.router.push('/home'))
    })

    it('should trigger login success action', () => {
      saga.next().put(actions.auth.loginSuccess())
    })

    it('should start logout timer', () => {
      saga.next().put(actions.auth.startLogoutTimer())
    })

    it('should run goals', () => {
      saga.next().put(actions.goals.runGoals())
    })

    it('should select guid from state', () => {
      saga.next().select(selectors.core.wallet.getGuid)
    })

    it('should cache guid', () => {
      const guid = 'guid'
      saga.next(guid).put(actions.cache.guidEntered(guid))
    })

    it('should reset auth state', () => {
      saga.next().put(actions.auth.setAuthType(0))
    })

    it('should clear login form', () => {
      saga.next().put(actions.form.destroy('login'))
    })

    it('should launch transferEth saga', () => {
      saga.next().fork(transferEthSaga)
    })

    it('should launch welcomeSaga', () => {
      saga.next().fork(welcomeSaga, firstLogin)
    })

    it('should launch reportStats saga', () => {
      saga.next().fork(reportStats, mobileLogin)
    })

    it('should start listening for logout event', () => {
      saga.next().call(setLogoutEventListener)
    })

    it('should launch logout routine saga upon logout event', () => {
      const stubLogoutEvent = {}
      saga.next(stubLogoutEvent).fork(logoutRoutine, stubLogoutEvent)
    })

    it('should display success if it\'s not first login', () => {
      const beforeEnd = 'beforeEnd'

      saga
        .next()
        .put(actions.alerts.displaySuccess(C.LOGIN_SUCCESS))
        .save(beforeEnd)
        .next()
        .isDone()
        .restore(beforeEnd)
    })

    it('should not display success if it\'s first login', () => {
      const firstLogin = false
      return expectSaga(loginRoutineSaga, mobileLogin, firstLogin)
        .provide([
          // Every async or value returning yield has to be mocked
          // for saga to progress
          [select(selectors.core.wallet.isHdWallet), true],
          [select(selectors.core.wallet.getGuid), 12],
          [fork.fn(transferEthSaga), jest.fn],
          [fork.fn(welcomeSaga), jest.fn],
          [fork.fn(reportStats), jest.fn],
          [call.fn(setLogoutEventListener), jest.fn],
          [fork.fn(logoutRoutine), jest.fn]
        ])
        .put(actions.alerts.displaySuccess(C.LOGIN_SUCCESS))
        .run()
    })

    describe('error handling', () => {
      it('should log error', () => {
        const error = {}
        saga
          .throw(error)
          .put(actions.logs.logErrorMessage(logLocation, 'loginRoutineSaga', error))
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
    const { loginRoutineSaga, register } = authSagas({
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

    it('should display restore wallet information alert', () => {
      saga.next().put(actions.alerts.displayInfo(C.CREATE_WALLET_INFO))
    })

    it('should pass payload to restoreWallet core saga', () => {
      saga.next().call(coreSagas.wallet.createWalletSaga, payload)
    })

    it('should display restore success alert', () => {
      saga.next().put(actions.alerts.displaySuccess(C.REGISTER_SUCCESS))
    })

    it('should call login routine saga with falsy mobileLogin and truthy firstLogin', () => {
      const mobileLogin = false
      const firstLogin = true
      saga.next().call(loginRoutineSaga, mobileLogin, firstLogin)
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
        saga
          .throw(error)
          .put(actions.auth.registerFailure())
      })

      it('should log restore error', () => {
        saga
          .next()
          .put(actions.logs.logErrorMessage(logLocation, 'register', error))
      })

      it('should show restore error alert', () => {
        saga
          .next()
          .put(actions.alerts.displayError(C.REGISTER_ERROR))
      })
    })
  })

  describe('restore flow', () => {
    const { loginRoutineSaga, restore } = authSagas({
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

    it('should call login routine saga with falsy mobileLogin and truthy firstLogin', () => {
      const mobileLogin = false
      const firstLogin = true
      saga.next().call(loginRoutineSaga, mobileLogin, firstLogin)
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
        saga
          .throw(error)
          .put(actions.auth.restoreFailure())
      })

      it('should log restore error', () => {
        saga
          .next()
          .put(actions.logs.logErrorMessage(logLocation, 'restore', error))
      })

      it('should show restore error alert', () => {
        saga
          .next()
          .put(actions.alerts.displayError(C.RESTORE_ERROR))
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

    it('should pass payload to core remindWalletGuidSaga', () => {
      saga.next().call(coreSagas.wallet.remindWalletGuidSaga, payload)
    })

    it('should show successful guid send alert', () => {
      saga
        .next()
        .put(actions.alerts.displaySuccess(C.GUID_SENT_SUCCESS))
        .next()
        .isDone()
    })

    describe('error handling', () => {
      describe('Other errors', () => {
        beforeAll(() => {
          saga.restart().next()
        })

        it('should log an error message', () => {
          const error = {}

          saga
            .throw(error)
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
        beforeAll(() => {
          saga.restart().next()
        })

        it('should log an error message', () => {
          const captchaError = {
            message: 'Captcha Code Incorrect'
          }

          saga
            .throw(captchaError)
            .put(actions.logs.logErrorMessage(logLocation, 'remindGuid', captchaError))
        })

        it('should refetch captcha in case of incorrect captcha', () => {
          saga
            .next()
            .put(actions.core.data.misc.fetchCaptcha())
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

    it('should stop sockets and redirect to logout', () => {
      expectSaga(logout)
        .put(actions.core.webSocket.bitcoin.stopSocket())
        .put(actions.core.webSocket.ethereum.stopSocket())
        .put(actions.core.webSocket.bch.stopSocket())
        .put(actions.router.push('/logout'))
        .run()
    })
  })

  describe('deauthorization of browser', () => {
    const { deauthorizeBrowser } = authSagas({
      api,
      coreSagas
    })
    const saga = testSaga(deauthorizeBrowser)
    const beforeCatch = 'beforeCatch'

    let pushStateSpy
    let locationReloadSpy
    beforeAll(() => {
      pushStateSpy = jest.spyOn(window.history, 'pushState').mockImplementation(() => {})
      locationReloadSpy = jest.spyOn(window.location, 'reload').mockImplementation(() => {})
    })
    afterAll(() => {
      pushStateSpy.restore()
      locationReloadSpy.restore()
    })

    const pageReloadTest = () =>
      it('should push login to url to history and reload window', () => {
        pushStateSpy.mockReset()
        locationReloadSpy.mockReset()

        saga
          .next()
          .inspect((gen) => {
            // Inside the called saga
            gen.next()
            expect(pushStateSpy).toHaveBeenCalledTimes(1)
            expect(pushStateSpy).toHaveBeenCalledWith('', '', '/login')

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
          .put(actions.logs.logErrorMessage(logLocation, 'deauthorizeBrowser', error))
      })

      it('should show error alert', () => {
        saga.next().put(actions.alerts.displayError(C.DEAUTHORIZE_BROWSER_ERROR))
      })

      pageReloadTest()
    })
  })
})
