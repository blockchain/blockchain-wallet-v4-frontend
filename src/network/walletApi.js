import Task from 'data.task'
import { assoc, compose, map, identity } from 'ramda'
import Promise from 'es6-promise'
import { Wrapper } from '../data'
import { futurizeP } from 'futurize'
import createApi from './Api'
Promise.polyfill()

const createWalletApi = ({rootUrl, apiUrl, apiCode} = {}, returnType) => {
  // ////////////////////////////////////////////////////////////////
  const ApiPromise = createApi({rootUrl, apiUrl, apiCode})
  const eitherToTask = e => e.fold(Task.rejected, Task.of)
  const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))
  const promiseToTask = futurizeP(Task)
  const future = returnType ? futurizeP(returnType) : identity
  // ////////////////////////////////////////////////////////////////
  const fetchWalletWithSharedKeyTask = (guid, sharedKey, password) =>
    promiseToTask(ApiPromise.fetchPayloadWithSharedKey)(guid, sharedKey)
      .map(Wrapper.fromEncJSON(password))
      .chain(eitherToTask)

  const fetchWalletWithSharedKey = compose(taskToPromise, fetchWalletWithSharedKeyTask)
  // ////////////////////////////////////////////////////////////////
  const fetchWalletWithSessionTask = (guid, session, password) =>
    promiseToTask(ApiPromise.fetchWalletWithSession)(guid, session)
      .map(Wrapper.fromEncJSON(password))
      .chain(eitherToTask)

  const fetchWalletWithSession = compose(taskToPromise, fetchWalletWithSessionTask)
  // ////////////////////////////////////////////////////////////////
  const fetchWallet = (guid, sharedKey, session, password) => {
    if (sharedKey) {
      return fetchWalletWithSharedKey(guid, sharedKey, password)
    }
    if (session) {
      return fetchWalletWithSession(guid, session, password)
    }
    return Promise.reject(new Error('MISSING_CREDENTIALS'))
  }
  // ////////////////////////////////////////////////////////////////
  const saveWalletTask = wrapper =>
    eitherToTask(Wrapper.toEncJSON(wrapper))
      .chain(promiseToTask(ApiPromise.savePayload))

  const saveWallet = compose(taskToPromise, saveWalletTask)
  // ////////////////////////////////////////////////////////////////
  const createWalletTask = email => wrapper =>
    eitherToTask(Wrapper.toEncJSON(wrapper))
      .map(assoc('email', email))
      .chain(promiseToTask(ApiPromise.createPayload))

  const createWallet = email => wrapper => compose(taskToPromise, createWalletTask(email))(wrapper)
  // ////////////////////////////////////////////////////////////////
  const Api = map(future, ApiPromise)

  return {
    ...Api,
    fetchWalletWithSharedKey: future(fetchWalletWithSharedKey),
    fetchWalletWithSession: future(fetchWalletWithSession),
    fetchWallet: future(fetchWallet),
    saveWallet: future(saveWallet),
    createWallet: future(createWallet)
  }
}
export default createWalletApi
