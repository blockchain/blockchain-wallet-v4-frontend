import { put } from 'redux-saga/effects'
import * as btcActions from '../data/bitcoin/actions'
import * as bchActions from '../data/bch/actions'
import * as ethActions from '../data/ethereum/actions'

export default () => {
  const refresh = function * () {
    yield put(btcActions.fetchData('', true))
    yield put(bchActions.fetchData('', true))
    yield put(ethActions.fetchData(true))
    yield put(btcActions.fetchRates())
    yield put(bchActions.fetchRates())
    yield put(ethActions.fetchRates())
  }

  return {
    refresh
  }
}
