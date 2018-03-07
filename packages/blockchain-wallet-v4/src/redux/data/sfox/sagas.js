import ExchangeDelegate from '../../../exchange/delegate'
import { apply, call, put, select } from 'redux-saga/effects'
import * as S from './selectors'
import * as A from './actions'
import * as AT from './actionTypes'
import * as walletSelectors from '../../wallet/selectors'
import * as buySellSelectors from '../../kvStore/buySell/selectors'
import * as buySellA from '../../kvStore/buySell/actions'

export const sfoxSaga = ({ api, sfoxService } = {}) => {
  const getSfox = function * () {
    const state = yield select()
    const delegate = new ExchangeDelegate(state, api)
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
      const sfox = yield call(getSfox)
      const signupResponse = yield apply(sfox, sfox.signup)

      yield put(buySellA.setProfileBuySell(signupResponse))
      yield put(A.setToken(signupResponse))
      yield put(A.signupSuccess(signupResponse))
    } catch (e) {
      yield put(A.signupFailure(e))
      console.warn('signup core saga error', e)
    }
  }

  const setProfile = function * (user) {
    const { firstName, lastName, middleName, dob, address1, address2, city, ssn, state, zipcode } = user.payload
    const sfox = yield call(getSfox)
    yield apply(sfox, sfox.fetchProfile)
    try {
      sfox.profile.firstName = firstName
      sfox.profile.middleName = middleName || ''
      sfox.profile.lastName = lastName
      sfox.profile.dateOfBirth = new Date(dob)
      sfox.profile.setSSN(ssn)
      sfox.profile.setAddress(
        address1,
        address2,
        city,
        state,
        zipcode
      )
      yield apply(sfox.profile, sfox.profile.verify)
      yield put(A.setProfileSuccess(sfox.profile))
    } catch (e) {
      yield put(A.setProfileFailure(e))
    }
  }

  return {
    setBankManually,
    signup,
    setProfile
  }
}
