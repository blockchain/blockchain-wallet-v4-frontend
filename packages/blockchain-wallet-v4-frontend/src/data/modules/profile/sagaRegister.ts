import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const {
    associateSofiUser,
    authAndRouteToExchangeAction,
    clearSession,
    createUser,
    fetchSofiUserStatus,
    fetchTiers,
    fetchUser,
    fetchUserCampaigns,
    fetchUserRiskSettings,
    initiateSofiLanding,
    linkFromExchangeAccount,
    linkToExchangeAccount,
    migrateSofiUser,
    redirectAfterAssociation,
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
    yield takeLatest(AT.FETCH_SOFI_USER_STATUS, fetchSofiUserStatus)
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
    yield takeLatest(AT.MIGRATE_SOFI_USER, migrateSofiUser)
    yield takeLatest(AT.INITIATE_SOFI_LANDING, initiateSofiLanding)
    yield takeLatest(AT.ASSOCIATE_SOFI_USER, associateSofiUser)
    yield takeLatest(AT.SOFI_REDIRECT_AFTER_EMAIL_VERIFICATION, redirectAfterAssociation)
  }
}
