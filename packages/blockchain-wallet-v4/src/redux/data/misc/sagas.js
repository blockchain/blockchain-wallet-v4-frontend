// import { call, put, select } from 'redux-saga/effects'
// import { compose, prop } from 'ramda'
// import { Wrapper, Wallet } from '../../../types'
// import { getCurrency } from '../../settings/selectors'
// import { getGuid, getSharedKey, getWalletContext } from '../../wallet/selectors'
// import readBlob from 'read-blob'
// import * as A from './actions'

export default ({ api }) => {
  // const fetchAdverts = function * ({ number }) {
  //   const response = yield call(api.getAdverts, number)
  //   yield put(A.setAdverts(response))
  // }

  // const fetchCaptcha = function * () {
  //   const timestamp = new Date().getTime()
  //   const sessionToken = yield call(api.obtainSessionToken)
  //   const response = yield call(api.getCaptchaImage, timestamp, sessionToken)
  //   const url = yield call(readBlob, response, 'dataurl')
  //   yield put(A.setCaptcha(url, sessionToken))
  // }

  // const fetchPriceIndexSeries = function * ({ coin, currency, start, scale }) {
  //   const response = yield call(api.getPriceIndexSeries, coin, currency, start, scale)
  //   yield put(A.setPriceIndexSeries(response))
  // }

  // const fetchLogs = function * () {
  //   const guid = yield select(getGuid)
  //   const sharedKey = yield select(getSharedKey)
  //   const response = yield call(api.getLogs, guid, sharedKey)
  //   yield put(A.setLogs(response.results))
  // }

  // const fetchTransactionHistory = function * ({ address, start, end }) {
  //   const currency = yield select(getCurrency)
  //   if (address) {
  //     const response = yield call(api.getTransactionHistory, address, currency, start, end)
  //     yield put(A.setTransactionHistory(response))
  //   } else {
  //     const context = yield select(getWalletContext)
  //     const active = context.join('|')
  //     const response = yield call(api.getTransactionHistory, active, currency, start, end)
  //     yield put(A.setTransactionHistory(response))
  //   }
  // }

  return {
    // fetchAdverts,
    // fetchCaptcha,
    // fetchPriceIndexSeries,
    // fetchLogs,
    // fetchTransactionHistory
  }
}
