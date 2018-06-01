import { put, select } from 'redux-saga/effects'
import * as btcActions from '../data/bitcoin/actions'
import * as bchActions from '../data/bch/actions'
import * as ethActions from '../data/ethereum/actions'
import * as btcSelectors from '../wallet/selectors'
import * as bchSelectors from '../kvStore/bch/selectors'

export default () => {
  const refresh = function * () {
    const btcSpendableContext = yield select(btcSelectors.getSpendableContext)
    const bchSpendableContext = yield select(bchSelectors.getSpendableContext)
    const btcUnspendableContext = yield select(btcSelectors.getUnspendableContext)
    const bchUnspendableContext = yield select(bchSelectors.getUnspendableContext)

    yield put(btcActions.fetchUnspendableBalance(btcUnspendableContext))
    yield put(bchActions.fetchUnspendableBalance(bchUnspendableContext))
    yield put(btcActions.fetchSpendableBalance(btcSpendableContext))
    yield put(bchActions.fetchSpendableBalance(bchSpendableContext))
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
