import { actionTypes } from 'redux-form'
import { takeEvery, takeLatest } from 'redux-saga/effects'

import * as routerActionTypes from 'data/router/actionTypes'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api }) => {
  const nftsSagas = sagas({ api })

  return function* nftSaga() {
    yield takeLatest(actions.acceptOffer, nftsSagas.acceptOffer)
    yield takeLatest(actions.cancelListing, nftsSagas.cancelListing)
    yield takeLatest(actions.cancelOffer, nftsSagas.cancelOffer)
    yield takeLatest(actions.clearAndRefetchOffersMade, nftsSagas.clearAndRefetchOffersMade)
    yield takeLatest(actions.createOffer, nftsSagas.createOffer)
    yield takeLatest(actions.createOrder, nftsSagas.createOrder)
    yield takeLatest(actions.createSellOrder, nftsSagas.createSellOrder)
    yield takeLatest(actions.createTransfer, nftsSagas.createTransfer)
    yield takeLatest(actions.fetchFees, nftsSagas.fetchFees)
    yield takeLatest(actions.fetchFeesWrapEth, nftsSagas.fetchFeesWrapEth)
    yield takeLatest(actions.fetchNftCollections, nftsSagas.fetchNftCollections)
    yield takeLatest(actions.fetchNftOffersMade, nftsSagas.fetchNftOffersMade)
    yield takeLatest(actions.fetchOpenSeaOrders, nftsSagas.fetchOpenSeaOrders)
    yield takeLatest(actions.fetchOpenseaAsset, nftsSagas.fetchOpenseaAsset)
    yield takeLatest(actions.fetchOpenseaStatus, nftsSagas.fetchOpenseaStatus)
    yield takeLatest(actions.nftOrderFlowClose, nftsSagas.nftOrderFlowClose)
    yield takeLatest(actions.nftOrderFlowOpen, nftsSagas.nftOrderFlowOpen)
    yield takeLatest(actions.nftSearch, nftsSagas.nftSearch)
    yield takeLatest(routerActionTypes.LOCATION_CHANGE, nftsSagas.handleRouterChange)
    yield takeEvery(actionTypes.CHANGE, nftsSagas.formChanged)
  }
}
