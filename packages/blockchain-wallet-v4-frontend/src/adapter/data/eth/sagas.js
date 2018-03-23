import { call, fork, put, take } from 'redux-saga/effects'
import { compose, dissoc, map, negate, mapObjIndexed, sortBy, sum, prop, values } from 'ramda'
import * as A from './actions'
import * as AT from './actionTypes'
import { api } from 'services/ApiService'

const watchData = function * (action) {
  while (true) {
    const action = yield take(AT.FETCH_ETH_DATA)
    yield call(fetchData, action)
  }
}

const fetchData = function * (action) {
  try {
    yield put(A.fetchDataLoading())
    const { context } = action.payload
    const data = yield call(api.getEthereumData, context)
    // Accounts treatments
    const finalBalance = sum(values(data).map(obj => obj.balance))
    const totalReceived = sum(values(data).map(obj => obj.totalReceived))
    const totalSent = sum(values(data).map(obj => obj.totalSent))
    const nTx = sum(values(data).map(obj => obj.txn_count))
    const addresses = mapObjIndexed((num, key, obj) => dissoc('txns', num), data)
    const transactions = mapObjIndexed((num, key, obj) => sortBy(compose(negate, prop('timeStamp')), prop('txns', num)), data)

    const ethereumData = {
      addresses,
      info: {
        n_tx: nTx,
        total_received: totalReceived,
        total_sent: totalSent,
        final_balance: finalBalance
      },
      transactions
    }
    yield put(A.fetchDataSuccess(ethereumData))
  } catch (e) {
    yield put(A.fetchDataFailure(e.message))
  }
}

const watchRates = function * (action) {
  while (true) {
    const action = yield take(AT.FETCH_ETH_RATES)
    yield call(fetchRates, action)
  }
}

const fetchRates = function * (action) {
  try {
    yield put(A.fetchRatesLoading())
    const data = yield call(api.getEthereumTicker)
    yield put(A.fetchRatesSuccess(data))
  } catch (e) {
    yield put(A.fetchRatesFailure(e.message))
  }
}

export default function * () {
  yield fork(fetchData)
  yield fork(fetchRates)
}
