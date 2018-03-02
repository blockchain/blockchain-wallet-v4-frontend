import ExchangeDelegate from '../../../exchange/delegate'
import { apply, call, put, select } from 'redux-saga/effects'
import * as S from './selectors'
import * as A from './actions'
import * as AT from './actionTypes'
import * as walletSelectors from '../../wallet/selectors'
import * as buySellSelectors from '../../kvStore/buySell/selectors'

export const sfoxSaga = ({ api, sfoxService } = {}) => {
  const getSfox = function * (token) {
    const state = yield select()
    const delegate = new ExchangeDelegate(state, token)
    const value = yield select(buySellSelectors.getMetadata)
    const sfox = sfoxService.refresh(value, delegate)
    return sfox
  }

  const setBankManually = function * (data) {
    const { routing, account, name, type } = data
    try {
      const sfox = yield call(getSfox)
      const methods = yield apply(sfox, sfox.getBuyMethods)
      // console.log('setbankmanually core saga', methods.ach, sfox)
      const addedBankAccount = yield apply(sfox, methods.ach.addAccount, [routing, account, name, type])
      // console.log('setbankmanually core saga2', addedBankAccount)
      yield put(A.setBankManuallySuccess(addedBankAccount))
    } catch (e) {
      console.warn('setBankManually core saga', e)
      yield put(A.setBankAccountFailure(e))
    }
  }

  const signup = function * () {
    try {
      let sfox = yield call(getSfox)
      const sharedKey = yield select(walletSelectors.getSharedKey)
      const guid = yield select(walletSelectors.getGuid)
      // console.log('sfox', sfox, sharedKey, guid)
      let data ={
        parter: 'sfox',
        guid: guid,
        sharedKey: sharedKey,
        fields: `email|mobile`
      }
      // console.log('before get token', data)
      const response = yield call(api.getTokenForDelegate, data)
      // console.log('after response', response)
      sfox = yield call(getSfox, response.token)
      // console.log('new sfox', sfox)
      // return self.delegate.getToken.bind(self.delegate)('sfox', {mobile: true});
      // `email${options.mobile ? '|mobile' : ''}${options.walletAge ? '|wallet_age' : ''}`


      // TODO get token here and pass it to delegate for sfox.signup
      const signupResponse = yield apply(sfox, sfox.signup)

      console.log('signupResponse', signupResponse)
      yield put(A.signupSuccess(signupResponse))
    } catch (e) {
      yield put(A.signupFailure(e))
      console.warn('signup core saga error', e)
    }
  }

  return {
    setBankManually,
    signup
  }
}
