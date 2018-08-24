import { delay } from 'redux-saga'
import { put, select, call, fork, cancel, spawn } from 'redux-saga/effects'
import moment from 'moment'
import { lift, equals } from 'ramda'

import { Remote } from 'blockchain-wallet-v4'
import { selectors, actions } from 'data'
import * as A from './actions'
import * as S from './selectors'

export const logLocation = 'modules/profile/sagas'
export const authCredentialsGenerationError =
  'Failed to generate auth credentials'
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
      yield call(renewUser)
      yield call(renewApiSockets)
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

  const renewUser = function*() {
    const user = yield call(api.getUser)
    yield put(A.setUserData(user))
  }

  const renewApiSockets = function*() {
    yield put(actions.middleware.webSocket.rates.stopSocket())
    yield put(actions.middleware.webSocket.rates.startSocket())
  }

  const clearSession = function*() {
    yield cancel(renewTask)
    renewTask = null
    yield put(A.setApiToken(Remote.NotAsked))
  }

  const generateRetailToken = function*() {
    const guid = yield select(selectors.core.wallet.getGuid)
    const sharedKey = yield select(selectors.core.wallet.getSharedKey)
    const { token } = yield call(api.generateRetailToken, guid, sharedKey)
    return token
  }

  const generateAuthCredentials = function*() {
    const retailToken = yield call(generateRetailToken)
    const { userId, token: lifetimeToken } = yield call(
      api.createUser,
      retailToken
    )
    yield put(
      actions.core.kvStore.userCredentials.setUserCredentials(
        userId,
        lifetimeToken
      )
    )
    return { userId, lifetimeToken }
  }

  const createUser = function*() {
    // session has already started
    if (renewTask !== null) return

    const userIdR = yield select(
      selectors.core.kvStore.userCredentials.getUserId
    )
    const lifetimeTokenR = yield select(
      selectors.core.kvStore.userCredentials.getLifetimeToken
    )
    const authCredentialsR = lift((userId, lifetimeToken) => ({
      userId,
      lifetimeToken
    }))(userIdR, lifetimeTokenR)
    const email = (yield select(selectors.core.settings.getEmail)).getOrFail()
    const guid = yield select(selectors.core.wallet.getGuid)

    const { userId, lifetimeToken } = yield authCredentialsR
      .map(authCredentials => {
        const { userId, lifetimeToken } = authCredentials
        if (!userId || !lifetimeToken) return call(generateAuthCredentials)
        return authCredentials
      })
      .getOrElse({})

    yield call(startSession, userId, lifetimeToken, email, guid)
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

  const syncUserWithWallet = function*() {
    const retailToken = yield call(generateRetailToken)
    const userData = yield call(api.syncUserWithWallet, retailToken)
    yield put(A.setUserData(userData))
  }

  return {
    signIn,
    clearSession,
    startSession,
    generateRetailToken,
    generateAuthCredentials,
    createUser,
    updateUser,
    updateUserAddress,
    syncUserWithWallet
  }
}
