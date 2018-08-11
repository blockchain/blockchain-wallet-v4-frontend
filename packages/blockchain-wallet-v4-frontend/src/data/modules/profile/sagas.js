import { delay } from 'redux-saga'
import { put, select, call, fork, cancel, take } from 'redux-saga/effects'
import moment from 'moment'
import { ifElse, isEmpty, identity } from 'ramda'

import { Remote } from 'blockchain-wallet-v4'
import { selectors, actions } from 'data'
import * as AT from './actionTypes'
import * as A from './actions'
import * as S from './selectors'
import { USER_ACTIVATION_STATES } from './model'

export const logLocation = 'modules/profile/sagas'

export default ({ api, coreSagas }) => {
  let renewTask = null

  const signIn = function*() {
    try {
      yield put(A.setApiToken(Remote.Loading))

      const email = (yield select(selectors.core.settings.getEmail)).getOrFail(
        'No email'
      )
      const guid = yield select(selectors.core.wallet.getGuid)

      yield call(coreSagas.kvStore.userCredentials.fetchMetadataUserCredentials)
      const userId = (yield select(
        selectors.core.kvStore.userCredentials.getUserId
      )).getOrElse(null)
      const lifetimeToken = (yield select(
        selectors.core.kvStore.userCredentials.getUserToken
      )).getOrElse(null)
      if (!userId || !lifetimeToken) return

      yield call(startSession, userId, lifetimeToken, email, guid)
    } catch (e) {}
  }

  const startSession = function*(userId, lifetimeToken, email, guid) {
    renewTask = yield fork(renewSession, userId, lifetimeToken, email, guid)
  }

  const clearSession = function*() {
    yield cancel(renewTask)
    renewTask = null
    yield put(A.setApiToken(Remote.NotAsked))
  }

  const renewSession = function*(userId, lifetimeToken, email, guid) {
    while (true) {
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
      yield delay(expiresIn)
    }
  }

  const createUser = function*({ payload }) {
    try {
      const { data } = payload
      const email = (yield select(selectors.core.settings.getEmail)).getOrFail()
      const guid = yield select(selectors.core.wallet.getGuid)

      const userIdR = yield select(
        selectors.core.kvStore.userCredentials.getUserId
      )
      const userId = yield userIdR
        .map(ifElse(isEmpty, () => call(generateUserId, email, guid), identity))
        .getOrFail('Failed to generate user id')
      const lifetimeTokenR = yield select(
        selectors.core.kvStore.userCredentials.getUserToken
      )
      const lifetimeToken = yield lifetimeTokenR
        .map(
          ifElse(
            isEmpty,
            () => call(generateLifetimeToken, userId, email, guid),
            identity
          )
        )
        .getOrFail('Failed to generate lifetime token')
      yield call(startSession, userId, lifetimeToken, email, guid)

      const {
        payload: { token }
      } = yield take(AT.SET_API_TOKEN)
      const { id } = yield call(api.createUser, data, token)
      yield put(
        A.setUserData({ ...data, id, state: USER_ACTIVATION_STATES.CREATED })
      )
    } catch (e) {}
  }

  const generateUserId = function*(email, guid) {
    const { userId } = yield call(api.generateUserId, email, guid)
    yield put(actions.core.kvStore.userCredentials.setUserId(userId))
    return userId
  }

  const generateLifetimeToken = function*(userId, email, guid) {
    const { token: lifetimeToken } = yield call(
      api.generateLifetimeToken,
      userId,
      email,
      guid
    )
    yield put(actions.core.kvStore.userCredentials.setUserToken(lifetimeToken))
    return lifetimeToken
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
    startSession,
    createUser,
    updateUser
  }
}
