
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { set } from 'ramda-lens'
import * as A from './actions'
import * as AT from './actionTypes'
import * as btcActions from '../data/bitcoin/actions'
import * as bchActions from '../data/bch/actions'
import * as ethActions from '../data/ethereum/actions'
import * as S from '../wallet/selectors'

export const refreshSaga = ({ api } = {}) => {
  const refresh = function * () {
    try {
      const walletContext = yield select(S.getWalletContext)
      yield put(btcActions.fetchData(walletContext))

      //  context?
      yield put(bchActions.fetchData(walletContext))
      yield put(btcActions.fetchRates())
      yield put(bchActions.fetchRates())
      yield put(ethActions.fetchRates())
      // ethereum balance
      // accounts?
      yield put(ethActions.fetchLatestBlock())
    } catch (e) {
    }
  }

  return function * () {
    yield takeLatest(AT.REFRESH, refresh)
  }
}
