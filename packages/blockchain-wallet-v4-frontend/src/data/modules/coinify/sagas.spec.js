import { select } from 'redux-saga/effects'

import { expectSaga, testSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import { coreSagasFactory } from 'blockchain-wallet-v4/src'
import * as actions from '../../actions'
import * as coinifyActions from './actions.js'
import * as selectors from '../../selectors.js'

import coinifySagas, { logLocation } from './sagas'
import * as C from 'services/AlertService'

jest.mock('blockchain-wallet-v4/src/redux/sagas')
const coreSagas = coreSagasFactory()

describe('coinifySagas', () => {
  beforeAll(() => {
    Math.random = () => 0.5
  })

  describe('coinify signup', () => {
    let { coinifySignup } = coinifySagas({
      coreSagas
    })

    const data = {
      payload: {
        country: 'FR'
      }
    }

    let saga = testSaga(coinifySignup, data)
    const beforeDetermine = 'beforeDetermine'

    it('should call core signup with the payload', () => {
      saga.next().call(coreSagas.data.coinify.signup, data.payload)
    })

    it('should select the profile', () => {
      saga.next().select(selectors.core.data.coinify.getProfile()).save(beforeDetermine)
    })

    it('should go to ISX step if no error', () => {
      const profile = { id: 1 }
      saga
        .next(profile)
        .call(coreSagas.data.coinify.triggerKYC)
        .next()
        .put(coinifyActions.coinifyNextStep('isx'))
    })

    it('should handle an error', () => {
      const errorProfile = { error: '{"error": "signup_error"}' }
      saga
        .restore(beforeDetermine)
        .next(errorProfile)
        .put(coinifyActions.coinifySignupFailure(JSON.parse(errorProfile.error)))
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log and display an error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(actions.logs.logErrorMessage(logLocation, 'coinifySignup', error))
          .next()
          .put(actions.alerts.displayError(C.COINIFY_SIGNUP_ERROR))
      })
    })
  })
})
