import { actionTypes } from 'redux-form'
import { takeEvery, takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api }) => {
  const nftsSagas = sagas({ api })

  return function* nftSaga() {
    yield takeLatest(actions.cancelListing, nftsSagas.cancelListing)
    yield takeLatest(actions.createBuyOrder, nftsSagas.createBuyOrder)
    yield takeLatest(actions.createSellOrder, nftsSagas.createSellOrder)
    yield takeLatest(actions.fetchNftAssets, nftsSagas.fetchNftAssets)
    yield takeLatest(actions.fetchNftOrders, nftsSagas.fetchNftOrders)
    yield takeLatest(actions.nftOrderFlowClose, nftsSagas.nftOrderFlowClose)
    yield takeLatest(actions.nftOrderFlowOpen, nftsSagas.nftOrderFlowOpen)
    yield takeLatest(actions.searchNftAssetContract, nftsSagas.searchNftAssetContract)
    yield takeEvery(actionTypes.CHANGE, nftsSagas.formChanged)
    yield takeEvery(actionTypes.INITIALIZE, nftsSagas.formInitialized)
  }
}
