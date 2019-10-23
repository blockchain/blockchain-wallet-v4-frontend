import Task from 'data.task'
import { compose, map, identity, propSatisfies, ifElse, contains } from 'ramda'
import Promise from 'es6-promise'
import { Wrapper } from '../types'
import { futurizeP } from 'futurize'
import createApi from './api'

const createWalletApi = (
  { options, apiKey, getAuthCredentials, reauthenticate, networks } = {},
  returnType
) => {
  // ////////////////////////////////////////////////////////////////
  const ApiPromise = createApi({
    options,
    apiKey,
    getAuthCredentials,
    reauthenticate,
    networks
  })
  const taskToPromise = t =>
    new Promise((resolve, reject) => t.fork(reject, resolve))
  const promiseToTask = futurizeP(Task)
  const future = returnType ? futurizeP(returnType) : identity
  const is2FAEnabled = ifElse(
    propSatisfies(x => x > 0, 'auth_type'),
    Task.rejected,
    Task.of
  )
  const is2FACodeValid = ifElse(
    x => contains('incorrect', x),
    Task.rejected,
    Task.of
  )

  // ////////////////////////////////////////////////////////////////
  const fetchWalletWithSharedKeyTask = (guid, sharedKey, password) =>
    promiseToTask(ApiPromise.fetchPayloadWithSharedKey)(guid, sharedKey).chain(
      Wrapper.fromEncJSON(password)
    )

  const fetchWalletWithSharedKey = compose(
    taskToPromise,
    fetchWalletWithSharedKeyTask
  )

  // ////////////////////////////////////////////////////////////////
  const fetchWalletWithSessionTask = (guid, session, password) =>
    promiseToTask(ApiPromise.fetchPayloadWithSession)(guid, session)
      .chain(is2FAEnabled)
      .chain(Wrapper.fromEncJSON(password))

  const fetchWalletWithSession = compose(
    taskToPromise,
    fetchWalletWithSessionTask
  )

  // ////////////////////////////////////////////////////////////////
  const fetchWalletWithTwoFactorTask = (
    guid,
    session,
    password,
    twoFactorCode
  ) =>
    promiseToTask(ApiPromise.fetchPayloadWithTwoFactorAuth)(
      guid,
      session,
      twoFactorCode
    )
      .chain(is2FACodeValid)
      .chain(Wrapper.fromEncPayload(password))

  const fetchWalletWithTwoFactor = compose(
    taskToPromise,
    fetchWalletWithTwoFactorTask
  )

  // ////////////////////////////////////////////////////////////////
  const fetchWallet = (guid, sharedKey, session, password, twoFactorCode) => {
    if (sharedKey) {
      return fetchWalletWithSharedKey(guid, sharedKey, password)
    }
    if (session) {
      if (twoFactorCode) {
        return fetchWalletWithTwoFactor(guid, session, password, twoFactorCode)
      } else {
        return fetchWalletWithSession(guid, session, password)
      }
    }
    return Promise.reject(new Error('MISSING_CREDENTIALS'))
  }

  // ////////////////////////////////////////////////////////////////
  const createWalletTask = email => wrapper => {
    const create = w => ApiPromise.createPayload(email, w)
    return Wrapper.toEncJSON(wrapper).chain(promiseToTask(create))
  }
  const createWallet = (email, wrapper) =>
    compose(
      taskToPromise,
      createWalletTask(email)
    )(wrapper)

  // ////////////////////////////////////////////////////////////////
  const Api = map(future, ApiPromise)

  return {
    ...Api,
    fetchWalletWithSharedKey: future(fetchWalletWithSharedKey),
    fetchWalletWithSession: future(fetchWalletWithSession),
    fetchWalletWithTwoFactor: future(fetchWalletWithTwoFactorTask),
    fetchWallet: future(fetchWallet),
    createWallet: future(createWallet)
  }
}
export default createWalletApi
