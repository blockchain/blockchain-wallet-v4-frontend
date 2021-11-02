import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api }) => {
  const nftsSagas = sagas({ api })

  return function* nftSaga() {
    yield takeLatest(actions.cancelListings, nftsSagas.cancelListings)
    yield takeLatest(actions.createBuyOrder, nftsSagas.createBuyOrder)
    yield takeLatest(actions.createSellOrder, nftsSagas.createSellOrder)
    yield takeLatest(actions.fetchNftAssets, nftsSagas.fetchNftAssets)
    yield takeLatest(actions.fetchNftOrders, nftsSagas.fetchNftOrders)
  }
}
