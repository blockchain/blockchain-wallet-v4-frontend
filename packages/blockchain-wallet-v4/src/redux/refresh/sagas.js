import { put, select } from 'redux-saga/effects'
import * as btcActions from '../data/bitcoin/actions'
import * as bchActions from '../data/bch/actions'
import * as ethActions from '../data/ethereum/actions'
import * as S from '../wallet/selectors'
import * as bchSelectors from '../kvStore/bch/selectors'
import * as ethSelectors from '../kvStore/ethereum/selectors'

export default () => {
  const refresh = function * () {
    const btcContext = yield select(S.getWalletContext)
    const bchContext = yield select(bchSelectors.getContext, btcContext)
    const ethContext = yield select(ethSelectors.getContext)
    yield put(btcActions.fetchData(btcContext))
    yield put(bchActions.fetchData(bchContext))
    yield put(ethActions.fetchData(ethContext.data))
    yield put(btcActions.fetchRates())
    yield put(bchActions.fetchRates())
    yield put(ethActions.fetchRates())
  }

  return {
    refresh
  }
}
