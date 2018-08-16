import { delay } from 'redux-saga'
import { put, select, call, fork, cancel, spawn } from 'redux-saga/effects'
import moment from 'moment'
import { ifElse, isEmpty, identity } from 'ramda'

import { Remote } from 'blockchain-wallet-v4'
import { selectors, actions } from 'data'
import * as A from './actions'
import * as S from './selectors'
import { USER_ACTIVATION_STATES } from './model'

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

  const createUser = function*({ payload }) {
    try {
      const { data } = payload
      const token = yield select(S.getApiToken)
      const { id } = yield call(api.createUser, data, token)
      yield put(
        A.setUserData({ ...data, id, state: USER_ACTIVATION_STATES.CREATED })
      )
    } catch (e) {}
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
    const { id, ...userData } = yield select(S.getUserData)
    const apiToken = (yield select(S.getApiToken)).getOrElse(null)
    const updatedData = { ...userData, ...data }
    yield call(api.updateUser, id, updatedData, apiToken)
    yield put(A.setUserData({ id, ...updatedData }))
  }

  return {
    signIn,
    clearSession,
    generateUserId,
    generateLifetimeToken,
    generateAuthCredentials,
    startSession,
    createUser,
    updateUser
  }
}
