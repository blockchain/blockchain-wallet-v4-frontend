import { actionTypes } from 'redux-form'
import { takeEvery, takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api }) => {
  const nftsSagas = sagas({ api })

  return function* nftSaga() {
    yield takeLatest(actions.acceptOffer, nftsSagas.acceptOffer)
    yield takeLatest(actions.cancelListing, nftsSagas.cancelListing)
    yield takeLatest(actions.cancelOffer, nftsSagas.cancelOffer)
    yield takeLatest(actions.clearAndRefetchAssets, nftsSagas.clearAndRefetchAssets)
    yield takeLatest(actions.clearAndRefetchOffersMade, nftsSagas.clearAndRefetchOffersMade)
    yield takeLatest(actions.createOffer, nftsSagas.createOffer)
    yield takeLatest(actions.createOrder, nftsSagas.createOrder)
    yield takeLatest(actions.createSellOrder, nftsSagas.createSellOrder)
    yield takeLatest(actions.createTransfer, nftsSagas.createTransfer)
    yield takeLatest(actions.fetchFees, nftsSagas.fetchFees)
    yield takeLatest(actions.fetchNftAssets, nftsSagas.fetchNftAssets)
    yield takeLatest(actions.fetchNftCollection, nftsSagas.fetchNftCollection)
    yield takeLatest(actions.fetchNftCollections, nftsSagas.fetchNftCollections)
    yield takeLatest(actions.fetchNftOffersMade, nftsSagas.fetchNftOffersMade)
    yield takeLatest(actions.fetchOpenseaAsset, nftsSagas.fetchOpenseaAsset)
    yield takeLatest(actions.fetchOpenseaStatus, nftsSagas.fetchOpenseaStatus)
    yield takeLatest(actions.nftOrderFlowClose, nftsSagas.nftOrderFlowClose)
    yield takeLatest(actions.nftOrderFlowOpen, nftsSagas.nftOrderFlowOpen)
    yield takeLatest(actions.searchNftAssetContract, nftsSagas.searchNftAssetContract)
    yield takeLatest(actions.wrapEth, nftsSagas.wrapEth)
    yield takeEvery(actionTypes.CHANGE, nftsSagas.formChanged)
  }
}
