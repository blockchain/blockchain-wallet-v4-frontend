import { put, select } from 'redux-saga/effects'

import { expectSaga, testSaga } from 'redux-saga-test-plan'
// import { dissocPath, curry } from 'ramda'

import * as sfoxActions from './actions.js'

import sfoxSagas from './sagas'
// import * as C from 'services/AlertService'

describe('sfoxSagas', () => {
  let api = { obtainSessionToken: () => { } }
  let coreSagas = { wallet: { fetchWalletSaga: () => { } } }

  describe('sfox signup', () => {
    let { sfoxSignup } = sfoxSagas({
      api,
      coreSagas
    })
    let saga = testSaga(sfoxSignup)

    it('should set loading', () => {
      saga.next().put(sfoxActions.sfoxLoading())
    })
  })
})
