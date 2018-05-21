import { put } from 'redux-saga/effects'
import * as btcActions from '../data/bitcoin/actions'
import * as bchActions from '../data/bch/actions'
import * as ethActions from '../data/ethereum/actions'

export default () => {
  const refresh = function * () {
    yield put(btcActions.fetchTransactions('', true))
    yield put(bchActions.fetchTransactions('', true))
    yield put(ethActions.fetchTransactions(true))
    yield put(btcActions.fetchRates())
    yield put(bchActions.fetchRates())
    yield put(ethActions.fetchRates())
  }

  return {
    refresh
  }
}
