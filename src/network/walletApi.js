import Task from 'data.task'
import { assoc, compose, map, identity } from 'ramda'
import Promise from 'es6-promise'
import { Wrapper } from '../data'
import { futurizeP } from 'futurize'
import createApi from './Api'
// import { Map } from 'immutable-ext'
// Promise.polyfill()

const createWalletApi = ({rootUrl, apiUrl, apiCode} = {}, returnType) => {
  const ApiPromise = createApi({rootUrl, apiUrl, apiCode})
  // helpers
  const eitherToTask = e => e.fold(Task.rejected, Task.of)
  const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))
  const promiseToTask = futurizeP(Task)
  const future = returnType ? futurizeP(returnType) : identity

  const getWalletWithSharedKeyTask = (guid, sharedKey, password) =>
    promiseToTask(ApiPromise.fetchWalletWithSharedKey)(guid, sharedKey)
      .map(Wrapper.fromEncJSON(password))
      .chain(eitherToTask)

  const getWalletWithSharedKey = compose(taskToPromise, getWalletWithSharedKeyTask)

  const getWalletWithSessionTask = (guid, session, password) =>
    promiseToTask(ApiPromise.fetchWalletWithSession)(guid, session)
      .map(Wrapper.fromEncJSON(password))
      .chain(eitherToTask)

  const getWalletWithSession = compose(taskToPromise, getWalletWithSessionTask)

  const getWallet = (guid, sharedKey, session, password) => {
    if (sharedKey) {
      return getWalletWithSharedKey(guid, sharedKey, password)
    }
    if (session) {
      return getWalletWithSession(guid, session, password)
    }
    return Promise.reject(new Error('MISSING_CREDENTIALS'))
  }

  const saveWalletTask = (wrapper) =>
    promiseToTask(ApiPromise.saveWallet)(Wrapper.toEncJSON(wrapper))

  const createWalletTask = email => wrapper =>
    promiseToTask(ApiPromise.createWallet)(assoc('email', email, Wrapper.toEncJSON(wrapper)))

  const saveWallet = compose(taskToPromise, saveWalletTask)
  const createWallet = email => state => compose(taskToPromise, createWalletTask(email))(state)

  // ////////////////////////////////////////////////////////////////
  // export const get = compose(taskToPromise, getTask)
  const Api = map(future, ApiPromise)

  return {
    ...Api,
    getWalletWithSharedKey: future(getWalletWithSharedKey),
    getWalletWithSession: future(getWalletWithSession),
    getWallet: future(getWallet),
    saveWallet: future(saveWallet),
    createWallet: future(createWallet)
  }
}
export default createWalletApi
