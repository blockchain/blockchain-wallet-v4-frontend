import { put, select } from 'redux-saga/effects'

import { expectSaga, testSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'

import * as actions from '../../actions'
import * as sfoxActions from './actions.js'
import * as selectors from '../../selectors.js'

import sfoxSagas, { logLocation } from './sagas'
// import * as C from 'services/AlertService'

describe('sfoxSagas', () => {
  let api = { obtainSessionToken: () => { } }
  let coreSagas = {
    wallet: {
      fetchWalletSaga: () => { }
    },
    data: {
      sfox: {
        signup: () => {}
      }
    }
  }

  describe('sfox signup', () => {
    let { sfoxSignup } = sfoxSagas({
      api,
      coreSagas
    })
    let saga = testSaga(sfoxSignup)

    it('should set loading', () => {
      saga.next().put(sfoxActions.sfoxLoading())
    })

    it('should call signup', () => {
      saga.next().call(coreSagas.data.sfox.signup)
    })

    it('should select the profile', () => {
      saga.next().select(selectors.core.data.sfox.getProfile)
    })

    describe('successful signup', () => {
      it('should be success', () => {
        const fakeUser = { name: 'Shmee', id: 10 }
        return expectSaga(sfoxSignup)
          .put({ type: '@COMPONENT.SFOX_LOADING' })
          .provide([
            [matchers.call.fn(coreSagas.data.sfox.signup)]
          ])
          .provide([
            [select(selectors.core.data.sfox.getProfile), fakeUser]
          ])
          .put({ type: '@COMPONENT.SFOX_SUCCESS' })
          .put({ type: '@COMPONENT.ENABLE_SIFT_SCIENCE' })
          .put({ type: '@COMPONENT.NEXT_STEP', payload: 'verify' })
          .run()
      })
    })

    describe('signup error', () => {
      it('should throw', () => {
        const profileError = {error: 'signup_error'}
        return expectSaga(sfoxSignup)
          .put({ type: '@COMPONENT.SFOX_LOADING' })
          .provide([
            [matchers.call.fn(coreSagas.data.sfox.signup)]
          ])
          .provide([
            [select(selectors.core.data.sfox.getProfile), profileError]
          ])
          .put({ type: '@COMPONENT.SFOX_NOT_ASKED' })
          .run()
      })
    })
  })
})
