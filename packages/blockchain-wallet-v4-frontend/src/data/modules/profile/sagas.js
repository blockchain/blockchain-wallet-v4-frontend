import { delay } from 'redux-saga'
import { put, select, call, fork, cancel, spawn } from 'redux-saga/effects'
import moment from 'moment'
import { ifElse, isEmpty, identity, equals } from 'ramda'

import { Remote } from 'blockchain-wallet-v4'
import { selectors, actions } from 'data'
import * as A from './actions'
import * as S from './selectors'

export const logLocation = 'modules/profile/sagas'
export const userIdError = 'Failed to generate user id'
export const lifetimeTokenError = 'Failed to generate lifetime token'
export const authRetryDelay = 5000

let renewTask = null
export default ({ api, coreSagas }) => {
  const signIn = function*() {
    try {
      const email = (yield select(selectors.core.settings.getEmail)).getOrFail(
        'No email'
      )
      const guid = yield select(selectors.core.wallet.getGuid)

      yield call(coreSagas.kvStore.userCredentials.fetchMetadataUserCredentials)
      const userId = (yield select(
        selectors.core.kvStore.userCredentials.getUserId
      )).getOrElse(null)
      const lifetimeToken = (yield select(
        selectors.core.kvStore.userCredentials.getLifetimeToken
      )).getOrElse(null)
      if (!userId || !lifetimeToken) return

      yield call(startSession, userId, lifetimeToken, email, guid)
      const user = yield call(api.getUser)
      yield put(A.setUserData(user))
    } catch (e) {}
  }

  const startSession = function*(userId, lifetimeToken, email, guid) {
    yield put(A.setApiToken(Remote.Loading))
    renewTask = yield fork(renewSession, userId, lifetimeToken, email, guid, 0)
  }

  const renewSession = function*(
    userId,
    lifetimeToken,
    email,
    guid,
    renewIn = 0
  ) {
    try {
      yield delay(renewIn)
      const { token: apiToken, expiresAt } = yield call(
        api.generateSession,
        userId,
        lifetimeToken,
        email,
        guid
      )
      yield put(A.setApiToken(Remote.of(apiToken)))
      const expiresIn = moment(expiresAt)
        .subtract(5, 's')
        .diff(moment())
      yield spawn(renewSession, userId, lifetimeToken, email, guid, expiresIn)
    } catch (e) {
      yield put(A.setApiToken(Remote.Failure(e)))
      yield spawn(
        renewSession,
        userId,
        lifetimeToken,
        email,
        guid,
        authRetryDelay
      )
    }
  }

  const clearSession = function*() {
    yield cancel(renewTask)
    renewTask = null
    yield put(A.setApiToken(Remote.NotAsked))
  }

  const generateAuthCredentials = function*() {
    // session has already started
    if (renewTask !== null) return

    const email = (yield select(selectors.core.settings.getEmail)).getOrFail()
    const guid = yield select(selectors.core.wallet.getGuid)

    const userIdR = yield select(
      selectors.core.kvStore.userCredentials.getUserId
    )
    const userId = yield userIdR
      .map(ifElse(isEmpty, () => call(generateUserId, email, guid), identity))
      .getOrFail(new Error(userIdError))
    const lifetimeTokenR = yield select(
      selectors.core.kvStore.userCredentials.getLifetimeToken
    )
    const lifetimeToken = yield lifetimeTokenR
      .map(
        ifElse(
          isEmpty,
          () => call(generateLifetimeToken, userId, email, guid),
          identity
        )
      )
      .getOrFail(new Error(lifetimeTokenError))
    yield call(startSession, userId, lifetimeToken, email, guid)
  }

  const generateUserId = function*(email, guid) {
    try {
      const { userId } = yield call(api.generateUserId, email, guid)
      yield put(actions.core.kvStore.userCredentials.setUserId(userId))
      return userId
    } catch (e) {
      throw new Error(userIdError)
    }
  }

  const generateLifetimeToken = function*(userId, email, guid) {
    try {
      const { token: lifetimeToken } = yield call(
        api.generateLifetimeToken,
        userId,
        email,
        guid
      )
      yield put(
        actions.core.kvStore.userCredentials.setLifetimeToken(lifetimeToken)
      )
      return lifetimeToken
    } catch (e) {
      throw new Error(lifetimeTokenError)
    }
  }

  const updateUser = function*({ payload }) {
    const { data } = payload
    const {
      id,
      address,
      mobile,
      mobileVerified,
      state,
      kycState,
      ...userData
    } = yield select(S.getUserData)
    const updatedData = { ...userData, ...data }

    if (equals(updatedData, userData)) return

    yield call(api.updateUser, updatedData)
    const user = yield call(api.getUser)
    yield put(A.setUserData(user))
  }

  const updateUserAddress = function*({ payload }) {
    const { address } = payload
    const { address: prevAddress } = yield select(S.getUserData)

    if (equals(address, prevAddress)) return

    yield call(api.updateUserAddress, address)
    const user = yield call(api.getUser)
    yield put(A.setUserData(user))
  }

  const updateUserMobile = function*({ payload }) {
    const { mobile } = payload
    const { mobile: prevMobile } = yield select(S.getUserData)

    if (prevMobile === mobile) return

    yield call(api.updateUserMobile, mobile)
    const user = yield call(api.getUser)
    yield put(A.setUserData(user))
  }

  return {
    signIn,
    clearSession,
    generateUserId,
    generateLifetimeToken,
    generateAuthCredentials,
    startSession,
    updateUser,
    updateUserAddress,
    updateUserMobile
  }
}
