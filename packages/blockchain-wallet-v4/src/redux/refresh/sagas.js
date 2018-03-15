import { put, select, throttle } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as btcActions from '../data/bitcoin/actions'
import * as bchActions from '../data/bch/actions'
import * as ethActions from '../data/ethereum/actions'
import * as S from '../wallet/selectors'
import * as ethSelectors from '../kvStore/ethereum/selectors'

export const refreshSaga = ({ api } = {}) => {
  const refresh = function * () {
    const walletContext = yield select(S.getWalletContext)
    yield put(btcActions.fetchData(walletContext))
    yield put(bchActions.fetchData(walletContext))
    const ethContext = yield select(ethSelectors.getContext)
    yield put(ethActions.fetchData(ethContext.data))
    yield put(btcActions.fetchRates())
    yield put(bchActions.fetchRates())
    yield put(ethActions.fetchRates())
    yield put(ethActions.fetchLatestBlock())
  }

  return function * () {
    yield throttle(5000, AT.REFRESH, refresh)
  }
}
