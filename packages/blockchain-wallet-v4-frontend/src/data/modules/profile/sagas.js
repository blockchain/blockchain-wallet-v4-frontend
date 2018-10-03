import { delay } from 'redux-saga'
import { put, select, call, fork, cancel, spawn } from 'redux-saga/effects'
import moment from 'moment'
import { equals, lift, prop } from 'ramda'

import { Remote } from 'blockchain-wallet-v4'
import { selectors, actions } from 'data'
import * as A from './actions'
import * as S from './selectors'
import { KYC_STATES } from './model'

export const logLocation = 'modules/profile/sagas'
export const authCredentialsGenerationError =
  'Failed to generate auth credentials'
export const userRequiresRestoreError = 'User restored'
export const authRetryDelay = 5000
export const renewUserDelay = 30000

let renewSessionTask = null
let renewUserTask = null
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

      yield put(A.setApiToken(Remote.Loading))
      renewSessionTask = yield fork(
        renewSession,
        userId,
        lifetimeToken,
        email,
        guid,
        0
      )
    } catch (e) {}
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
      yield call(setSession, userId, lifetimeToken, email, guid)
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

  const setSession = function*(userId, lifetimeToken, email, guid) {
    try {
      const { token: apiToken, expiresAt } = yield call(
        api.generateSession,
        userId,
        lifetimeToken,
        email,
        guid
      )
      yield put(A.setApiToken(Remote.of(apiToken)))
      yield call(fetchUser)
      yield call(renewApiSockets)
      const expiresIn = moment(expiresAt)
        .subtract(5, 's')
        .diff(moment())
      yield spawn(renewSession, userId, lifetimeToken, email, guid, expiresIn)
    } catch (e) {
      if (prop('description', e) === userRequiresRestoreError) {
        return yield call(recoverUser)
      }
      throw e
    }
  }

  const fetchUser = function*() {
    const user = yield call(api.getUser)
    yield put(A.setUserData(user))
    if (!renewUserTask && user.kycState === KYC_STATES.PENDING)
      renewUserTask = yield fork(renewUser)
  }

  const renewUser = function*(renewIn = 0) {
    yield delay(renewIn)
    const user = yield call(api.getUser)
    yield put(A.setUserData(user))
    yield spawn(renewUser, renewUserDelay)
  }

  const renewApiSockets = function*() {
    yield put(actions.middleware.webSocket.rates.stopSocket())
    yield put(actions.middleware.webSocket.rates.startSocket())
  }

  const clearSession = function*() {
    if (renewSessionTask) {
      yield cancel(renewSessionTask)
      renewSessionTask = null
    }
    if (renewUserTask) {
      yield cancel(renewUserTask)
      renewUserTask = null
    }

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

  const recoverUser = function*() {
    const retailToken = yield call(generateRetailToken)
    const userId = (yield select(
      selectors.core.kvStore.userCredentials.getUserId
    )).getOrFail()
    const lifetimeToken = (yield select(
      selectors.core.kvStore.userCredentials.getLifetimeToken
    )).getOrFail()
    yield call(api.recoverUser, userId, lifetimeToken, retailToken)
    const email = (yield select(selectors.core.settings.getEmail)).getOrFail()
    const guid = yield select(selectors.core.wallet.getGuid)
    yield call(setSession, userId, lifetimeToken, email, guid)
  }

  const createUser = function*() {
    const token = yield select(S.getApiToken)
    if (!Remote.NotAsked.is(token)) return

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

    yield call(setSession, userId, lifetimeToken, email, guid)
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
    yield call(fetchUser)
  }

  const updateUserAddress = function*({ payload }) {
    const { address } = payload
    const { address: prevAddress } = yield select(S.getUserData)

    if (equals(address, prevAddress)) return

    yield call(api.updateUserAddress, address)
    yield call(fetchUser)
  }

  const syncUserWithWallet = function*() {
    const retailToken = yield call(generateRetailToken)
    const userData = yield call(api.syncUserWithWallet, retailToken)
    yield put(A.setUserData(userData))
  }

  return {
    signIn,
    clearSession,
    setSession,
    renewSession,
    generateRetailToken,
    generateAuthCredentials,
    createUser,
    updateUser,
    updateUserAddress,
    fetchUser,
    renewApiSockets,
    renewUser,
    syncUserWithWallet,
    recoverUser
  }
}
