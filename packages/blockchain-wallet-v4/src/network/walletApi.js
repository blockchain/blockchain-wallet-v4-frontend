import Task from 'data.task'
import Promise from 'es6-promise'
import { futurizeP } from 'futurize'
import { compose, identity, ifElse, includes, map, propSatisfies } from 'ramda'

import { Wrapper } from '../types'
import { isWrapper } from '../types/Wrapper'
import createApi from './api'

const createWalletApi = (
  { apiKey, getAuthCredentials, networks, options, reauthenticate } = {},
  returnType
) => {
  const ApiPromise = createApi({
    apiKey,
    getAuthCredentials,
    networks,
    options,
    reauthenticate
  })
  const taskToPromise = (t) => new Promise((resolve, reject) => t.fork(reject, resolve))
  const promiseToTask = futurizeP(Task)
  const future = returnType ? futurizeP(returnType) : identity
  const is2FAEnabled = ifElse(
    propSatisfies((x) => x > 0, 'auth_type'),
    Task.rejected,
    Task.of
  )
  const is2FACodeValid = ifElse((x) => includes('incorrect', x), Task.rejected, Task.of)

  // **********

  const fetchWalletWithSharedKeyTask = (guid, sharedKey, password) =>
    promiseToTask(ApiPromise.fetchPayloadWithSharedKey)(guid, sharedKey).chain(
      Wrapper.fromEncJSON(password)
    )
  const fetchWalletWithSharedKey = compose(taskToPromise, fetchWalletWithSharedKeyTask)

  // **********

  const fetchWalletWithSessionTask = (guid, session, password) =>
    promiseToTask(ApiPromise.fetchPayloadWithSession)(guid, session)
      .chain(is2FAEnabled)
      .chain(Wrapper.fromEncJSON(password))
  const fetchWalletWithSession = compose(taskToPromise, fetchWalletWithSessionTask)

  // **********

  const fetchWalletWithTwoFactorTask = (guid, session, password, twoFactorCode) =>
    promiseToTask(ApiPromise.fetchPayloadWithTwoFactorAuth)(guid, session, twoFactorCode)
      .chain(is2FACodeValid)
      .chain(Wrapper.fromEncPayload(password))
  const fetchWalletWithTwoFactor = compose(taskToPromise, fetchWalletWithTwoFactorTask)

  // **********

  const fetchWallet = (guid, sharedKey, session, password, twoFactorCode) => {
    if (sharedKey) {
      return fetchWalletWithSharedKey(guid, sharedKey, password)
    }
    if (session) {
      if (twoFactorCode) {
        return fetchWalletWithTwoFactor(guid, session, password, twoFactorCode)
      }
      return fetchWalletWithSession(guid, session, password)
    }
    return Promise.reject(new Error('MISSING_CREDENTIALS'))
  }

  // **********

  const saveWalletTask = (wrapper) =>
    Wrapper.toEncJSON(wrapper).chain(promiseToTask(ApiPromise.savePayload))
  const saveWallet = compose(taskToPromise, saveWalletTask)

  // **********

  const createWalletTask = (email, captchaToken, forceVerifyEmail) => (wrapper) => {
    const create = (data) => ApiPromise.createPayload(email, captchaToken, forceVerifyEmail, data)
    return Wrapper.toEncJSON(wrapper).chain(promiseToTask(create))
  }

  const createWallet = (email, captchaToken, wrapper, forceVerifyEmail) =>
    compose(taskToPromise, createWalletTask(email, captchaToken, forceVerifyEmail))(wrapper)

  // **********

  const createResetWalletTask = (email, captchaToken, sessionToken) => (wrapper) => {
    const create = (data) =>
      ApiPromise.createResetAccountPayload(email, captchaToken, sessionToken, data)
    return Wrapper.toEncJSON(wrapper).chain(promiseToTask(create))
  }

  const createResetWallet = (email, captchaToken, wrapper, sessionToken) =>
    compose(taskToPromise, createResetWalletTask(email, captchaToken, sessionToken))(wrapper)

  const Api = map(future, ApiPromise)

  return {
    ...Api,
    createResetWallet: future(createResetWallet),
    createWallet: future(createWallet),
    fetchWallet: future(fetchWallet),
    fetchWalletWithSession: future(fetchWalletWithSession),
    fetchWalletWithSharedKey: future(fetchWalletWithSharedKey),
    fetchWalletWithTwoFactor: future(fetchWalletWithTwoFactorTask),
    saveWallet: future(saveWallet)
  }
}

export default createWalletApi
