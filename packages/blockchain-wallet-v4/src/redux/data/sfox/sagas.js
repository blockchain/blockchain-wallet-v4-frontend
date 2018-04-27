import ExchangeDelegate from '../../../exchange/delegate'
import { apply, call, put, select } from 'redux-saga/effects'
import * as S from './selectors'
import * as A from './actions'
import * as buySellSelectors from '../../kvStore/buySell/selectors'
import * as buySellA from '../../kvStore/buySell/actions'
import { sfoxService } from '../../../exchange/service'

export default ({ api, options }) => {
  const getSfox = function * () {
    const state = yield select()
    const delegate = new ExchangeDelegate(state, api)
    const value = yield select(buySellSelectors.getMetadata)
    const walletOptions = state.walletOptionsPath.data
    const sfox = sfoxService.refresh(value, delegate, walletOptions)
    return sfox
  }

  const setBankManually = function * (data) {
    const { routing, account, name, type } = data
    try {
      const sfox = yield call(getSfox)
      const methods = yield apply(sfox, sfox.getBuyMethods)
      const addedBankAccount = yield apply(methods.ach, methods.ach.addAccount, [routing, account, name, type])
      yield put(A.setBankManuallySuccess(addedBankAccount))
    } catch (e) {
      yield put(A.setBankAccountFailure(e))
    }
  }

  const signup = function * () {
    try {
      const sfox = yield call(getSfox)
      const signupResponse = yield apply(sfox, sfox.signup)

      yield put(buySellA.sfoxSetProfileBuySell(signupResponse))
      yield put(A.setToken(signupResponse))
      yield put(A.signupSuccess(signupResponse))
    } catch (e) {
      yield put(A.signupFailure(e))
    }
  }

  const setProfile = function * (user) {
    const { firstName, lastName, dob, address1, address2, city, ssn, state, zipcode } = user.payload
    const sfox = yield call(getSfox)
    yield apply(sfox, sfox.fetchProfile)
    try {
      sfox.profile.firstName = firstName
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

  const uploadDoc = function * (data) {
    const { idType, file } = data.payload
    try {
      const sfox = yield call(getSfox)
      const profile = yield select(S.getProfile)
      const sfoxUrl = yield apply(profile.data, profile.data.getSignedURL, [idType, file.name])

      yield call(api.uploadVerificationDocument, sfoxUrl.signed_url, file)

      const profileAfterUpload = yield apply(sfox, sfox.fetchProfile)
      yield put(A.fetchProfileSuccess(profileAfterUpload))
    } catch (e) {
      yield put(A.uploadFailure(e))
    }
  }

  const setBankAccount = function * (data) {
    const bank = data.payload
    try {
      const sfox = yield call(getSfox)
      yield apply(sfox.bankLink, sfox.bankLink.setAccount, [bank])

      const methods = yield apply(sfox, sfox.getBuyMethods)
      const accounts = yield apply(sfox, methods.ach.getAccounts)
      yield put(A.sfoxFetchAccountsSuccess(accounts))
    } catch (e) {
      yield put(A.sfoxFetchAccountsFailure(e))
    }
  }

  const verifyMicroDeposits = function * (data) {
    const { amount1, amount2 } = data.payload
    try {
      const accounts = yield select(S.getAccounts)
      const response = yield apply(accounts.data[0], accounts.data[0].verify, [amount1, amount2])
      console.log('deposits response', response)
      /*
        valid response: {payment_method_id: "69fa19d0-f045-4097-96ec-4e1c74ccc695", status: "active"}
                        payment_method_id:"69fa19d0-f045-4097-96ec-4e1c74ccc695"
                        status:"active"

         may need to call payment methods after this resolves
      */
    } catch (e) {
      console.warn(e)
    }
  }

  const handleTrade = function * (quote) {
    try {
      yield put(A.handleTradeLoading())
      const accounts = yield select(S.getAccounts)
      const methods = yield apply(quote, quote.getPaymentMediums)
      const trade = yield apply(methods.ach, methods.ach.buy, [accounts.data[0]])
      yield put(A.handleTradeSuccess(trade))
      yield put(A.fetchProfile())
      yield put(A.fetchTrades())
      const trades = yield select(S.getTrades)
      yield put(buySellA.setTradesBuySell(trades.data))
    } catch (e) {
      console.warn(e)
      yield put(A.handleTradeFailure(e))
    }
  }

  const handleSellTrade = function * (quote) {
    try {
      yield put(A.handleTradeLoading())
      const accounts = yield select(S.getAccounts)
      const methods = yield apply(quote, quote.getPaymentMediums)
      const trade = yield apply(methods.ach, methods.ach.sell, [accounts.data[0]])
      yield put(A.handleTradeSuccess(trade))

      yield put(A.fetchProfile())
      yield put(A.fetchTrades())
      const trades = yield select(S.getTrades)
      yield put(buySellA.setTradesBuySell(trades.data))
      return trade
    } catch (e) {
      console.log(e)
      yield put(A.handleTradeFailure(e))
    }
  }

  return {
    setBankManually,
    signup,
    setProfile,
    uploadDoc,
    setBankAccount,
    verifyMicroDeposits,
    handleTrade,
    handleSellTrade
  }
}
