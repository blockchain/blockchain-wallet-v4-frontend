import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const {
    authAndRouteToExchangeAction,
    clearSession,
    createUser,
    fetchTiers,
    fetchUser,
    fetchUserCampaigns,
    fetchUserRiskSettings,
    linkFromExchangeAccount,
    linkToExchangeAccount,
    shareWalletAddressesWithExchange,
    signIn
  } = sagas({
    api,
    coreSagas,
    networks
  })

  return function* profileSaga() {
    yield takeLatest(AT.SIGN_IN, signIn)
    yield takeLatest(AT.CLEAR_SESSION, clearSession)
    yield takeLatest(AT.CREATE_USER, createUser)
    yield takeLatest(AT.FETCH_USER, fetchUser)
    yield takeLatest(AT.FETCH_TIERS, fetchTiers)
    yield takeLatest(AT.FETCH_USER_RISK_SETTINGS, fetchUserRiskSettings)
    yield takeLatest(AT.FETCH_USER_CAMPAIGNS, fetchUserCampaigns)
    yield takeLatest(AT.AUTH_AND_ROUTE_TO_EXCHANGE, authAndRouteToExchangeAction)
    // @ts-ignore
    yield takeLatest(AT.LINK_FROM_EXCHANGE_ACCOUNT, linkFromExchangeAccount)
    // @ts-ignore
    yield takeLatest(AT.LINK_TO_EXCHANGE_ACCOUNT, linkToExchangeAccount)
    yield takeLatest(AT.SHARE_WALLET_ADDRESSES_WITH_EXCHANGE, shareWalletAddressesWithExchange)
  }
}
