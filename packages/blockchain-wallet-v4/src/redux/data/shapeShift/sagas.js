// import { all, call, put } from 'redux-saga/effects'
// import { map } from 'ramda'
// import * as A from './actions'

export default ({ api }) => {
  // const fetchBtcEth = function * () {
  //   const response = yield call(api.getBtcEth)
  //   yield put(A.setBtcEth(response))
  // }

  // const fetchEthBtc = function * () {
  //   const response = yield call(api.getEthBtc)
  //   yield put(A.setEthBtc(response))
  // }

  // const createOrder = function * (payload) {
  //   const response = yield call(api.createOrder, payload)
  //   yield put(A.setOrder(response))
  // }

  // const getTradeStatus = function * (address) {
  //   const response = yield call(api.getTradeStatus, address)
  //   yield put(A.setTradeStatus(response))
  // }

  // const getTradesStatus = function * (addresses) {
  //   yield all(map(a => call(getTradeStatus, a), addresses))
  // }

  // return {
  //   fetchBtcEth,
  //   fetchEthBtc,
  //   createOrder,
  //   getTradeStatus,
  //   getTradesStatus
  // }
}
