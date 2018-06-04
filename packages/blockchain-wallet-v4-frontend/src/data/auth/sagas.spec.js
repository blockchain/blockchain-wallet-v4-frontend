import { call, put, select } from 'redux-saga/effects'

import * as selectors from '../selectors.js'
import * as actions from '../actions.js'
import authSagas from './sagas'

describe('authSagas', () => {
  let api = { obtainSessionToken: () => {} }
  let coreSagas = { wallet: { fetchWalletSaga: () => {} } }

  describe('*login', () => {
    let { login, loginRoutineSaga } = authSagas({ api, coreSagas })
    let payload = {guid: '123abc456def', password: 'blockchain', code: undefined, sharedKey: undefined, mobileLogin: undefined}
    let gen = login({ payload })

    it('should select getSession', () => {
      expect(gen.next().value).toEqual(select(selectors.session.getSession, '123abc456def'))
    })
    it('should call obtainSessionToken', () => {
      expect(gen.next().value).toEqual(call(api.obtainSessionToken))
    })
    it('should put saveSession', () => {
      expect(gen.next('sessionToken').value).toEqual(put(actions.session.saveSession({'123abc456def': 'sessionToken'})))
    })
    it('should cache guid', () => {
      expect(gen.next('123abc456def').value).toEqual(put(actions.cache.guidEntered('123abc456def')))
    })
    it('should put login loading', () => {
      expect(gen.next().value).toEqual(put(actions.auth.loginLoading()))
    })
    it('should fetch wallet', () => {
      const { guid, password, code, sharedKey } = payload
      expect(gen.next().value).toEqual(call(coreSagas.wallet.fetchWalletSaga, { guid, password, code, sharedKey, session: 'sessionToken' }))
    })
    it('should call login routine', () => {
      const { mobileLogin } = payload
      expect(gen.next().value).toEqual(call(loginRoutineSaga, mobileLogin))
    })
    it('should put login success', () => {
      expect(gen.next().value).toEqual(put(actions.auth.loginSuccess()))
    })
    describe('catch', () => {
      let gen = login({ payload })
      gen.next()
      gen.next()
      gen.next('sessionToken')
      gen.next('123abc456def')
      expect(gen.next().value).toEqual(put(actions.auth.loginLoading()))
      expect(gen.throw({ message: 'error' }).value).toEqual(put(actions.auth.loginFailure('error')))
    })
  })
})
