import { call, put } from 'redux-saga/effects'
import * as A from './actions'

export const shapeShift = ({ api } = {}) => {
  const fetchBtcEth = function * () {
    const response = yield call(api.getBtcEth)
    yield put(A.setBtcEth(response))
  }

  const fetchEthBtc = function * () {
    const response = yield call(api.getEthBtc)
    yield put(A.setEthBtc(response))
  }

  const createOrder = function * (payload) {
    const response = yield call(api.createOrder, payload)
    yield put(A.setOrder(response))
  }

  return {
    fetchBtcEth,
    fetchEthBtc,
    createOrder
  }
}
