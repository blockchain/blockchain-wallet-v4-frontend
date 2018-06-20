import { put, select } from 'redux-saga/effects'

import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { dissocPath, curry } from 'ramda'

import * as selectors from '../selectors.js'
import * as actions from '../actions.js'
import authSagas, {
  defaultLoginErrorMessage,
  wrongWalletPassErrorMessage,
  logLocation
} from './sagas'
import * as C from 'services/AlertService'

// NB: can be used as an utilite in multiple saga tests
const assertDisplayAction = curry((expectedAction, incomingAction) => {
  const dissocId = dissocPath(['PUT', 'action', 'payload', 'id'])
  expect(dissocId(incomingAction)).toEqual(dissocId(put(expectedAction)))
})

describe('authSagas', () => {
  let api = { obtainSessionToken: () => {} }
  let coreSagas = { wallet: { fetchWalletSaga: () => {} } }

  describe('login flow', () => {
    let { login, loginRoutineSaga, pollingSession } = authSagas({
      api,
      coreSagas
    })
    const guid = '123abc456def'
    const password = 'blockchain'
    const sessionIdStub = 'id'
    let payload = {
      guid,
      password,
      code: undefined,
      sharedKey: undefined,
      mobileLogin: undefined
    }
    let saga = testSaga(login, { payload })

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
            .inspect(
              assertDisplayAction(
                actions.alerts.displayInfo(C.AUTHORIZATION_REQUIRED_INFO)
              )
            )
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
            .inspect(
              assertDisplayAction(
                actions.alerts.displayError(C.WALLET_SESSION_ERROR)
              )
            )
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
              .inspect(
                assertDisplayAction(
                  actions.alerts.displayInfo(C.TWOFA_REQUIRED_INFO)
                )
              )
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
            .inspect(
              assertDisplayAction(
                actions.alerts.displayInfo(C.TWOFA_REQUIRED_INFO)
              )
            )
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
})
