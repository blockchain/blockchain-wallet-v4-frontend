import { actionTypes } from 'redux-form'
import { takeEvery, takeLatest } from 'redux-saga/effects'

import * as routerActionTypes from 'data/router/actionTypes'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api, coreSagas, networks }) => {
  const nftsSagas = sagas({ api, coreSagas, networks })

  return function* nftSaga() {
    yield takeLatest(actions.acceptOffer, nftsSagas.acceptOffer)
    yield takeLatest(actions.cancelListing, nftsSagas.cancelListing)
    yield takeLatest(actions.cancelOffer, nftsSagas.cancelOffer)
    yield takeLatest(actions.createOffer, nftsSagas.createOffer)
    yield takeLatest(actions.createOrder, nftsSagas.createOrder)
    yield takeLatest(actions.createListing, nftsSagas.createListing)
    yield takeLatest(actions.createTransfer, nftsSagas.createTransfer)
    yield takeLatest(actions.fetchFees, nftsSagas.fetchFees)
    yield takeLatest(actions.fetchFeesWrapEth, nftsSagas.fetchFeesWrapEth)
    yield takeLatest(actions.fetchOpenSeaAsset, nftsSagas.fetchOpenSeaAsset)
    yield takeLatest(actions.fetchOpenseaStatus, nftsSagas.fetchOpenseaStatus)
    yield takeLatest(actions.fetchNftOwnerAssets, nftsSagas.fetchNftOwnerAssets)
    yield takeLatest(actions.fetchNftUserPreferences, nftsSagas.fetchNftUserPreferences)
    yield takeLatest(actions.updateUserPreferences, nftsSagas.updateUserPreferences)
    yield takeLatest(actions.handleRouterChange, nftsSagas.handleRouterChange)
    yield takeLatest(actions.nftOrderFlowOpen, nftsSagas.nftOrderFlowOpen)
    yield takeLatest(actions.nftSearch, nftsSagas.nftSearch)
    yield takeLatest(routerActionTypes.LOCATION_CHANGE, nftsSagas.handleRouterChange)
    yield takeEvery(actionTypes.CHANGE, nftsSagas.formChanged)
    // TODO: SEAPORT - remove wyvern
    yield takeLatest(actions.fetchFees_LEGACY, nftsSagas.fetchFees_LEGACY)
    yield takeLatest(actions.acceptOffer_LEGACY, nftsSagas.acceptOffer_LEGACY)
    yield takeLatest(actions.cancelListing_LEGACY, nftsSagas.cancelListing_LEGACY)
    yield takeLatest(actions.cancelOffer_LEGACY, nftsSagas.cancelOffer_LEGACY)
    yield takeLatest(actions.createListing_LEGACY, nftsSagas.createListing_LEGACY)
    yield takeLatest(actions.createOffer_LEGACY, nftsSagas.createOffer_LEGACY)
    yield takeLatest(actions.createOrder_LEGACY, nftsSagas.createOrder_LEGACY)
    yield takeLatest(actions.nftOrderFlowOpen_LEGACY, nftsSagas.nftOrderFlowOpen)
  }
}
