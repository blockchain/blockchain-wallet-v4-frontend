/* eslint-disable semi */
import Task from 'data.task'
import { assoc, dissoc, lensProp, over, compose, map, identity } from 'ramda'
import * as WCrypto from '../WalletCrypto'
import Promise from 'es6-promise'
import { Wallet } from '../data'
import * as WalletUtil from '../data/Wallet'
import { futurizeP } from 'futurize'
import createApi from './Api'
import { Map } from 'immutable-ext'
Promise.polyfill()

const createWalletApi = ({rootUrl, apiUrl, apiCode} = {}, returnType) => {
  const ApiPromise = createApi({rootUrl, apiUrl, apiCode});
  // helpers
  const eitherToTask = e => e.fold(Task.rejected, Task.of)
  const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))
  const promiseToTask = futurizeP(Task)
  const future = returnType ? futurizeP(returnType) : identity

  const decrypt = (password) => (response) => response
    .map(over(lensProp('payload'), JSON.parse))
    .map(WCrypto.decryptPayload(password))
    .chain(eitherToTask)
    .map(over(lensProp('walletImmutable'), WalletUtil.fromJS))
    .map(dissoc('extra_seed'))
    .map(dissoc('symbol_btc'))
    .map(dissoc('symbol_local'))
    .map(dissoc('guid'))
    .map(Map)

  const getWalletTask = (guid, sharedKey, password) =>
    decrypt(password)(promiseToTask(ApiPromise.fetchWalletWithSharedKey)(guid, sharedKey))

  const getWallet = compose(taskToPromise, getWalletTask)

  const fetchWalletTask = (guid, session, password) =>
    decrypt(password)(promiseToTask(ApiPromise.fetchWalletWithSession)(guid, session))

  const fetchWallet = compose(taskToPromise, fetchWalletTask)

  const downloadWallet = (guid, sharedKey, session, password) => {
    if (sharedKey) {
      return getWallet(guid, sharedKey, password)
    }
    if (session) {
      return fetchWallet(guid, session, password)
    }
    return Promise.reject(new Error('MISSING_CREDENTIALS'))
  }

  const saveWalletTask = (state) =>
    promiseToTask(ApiPromise.saveWallet)(WCrypto.encryptState(state))

  const createWalletTask = email => state =>
    promiseToTask(ApiPromise.createWallet)(assoc('email', email, WCrypto.encryptState(state)))

  const saveWallet = compose(taskToPromise, saveWalletTask)
  const createWallet = email => state => compose(taskToPromise, createWalletTask(email))(state)

  // ////////////////////////////////////////////////////////////////
  // export const get = compose(taskToPromise, getTask)
  const Api = map(future, ApiPromise)

  // TODO :: we should rename or unify get,fetch,download functions
  return {
    ...Api,
    getWallet: future(getWallet),
    fetchWallet: future(fetchWallet),
    downloadWallet: future(downloadWallet),
    saveWallet: future(saveWallet),
    createWallet: future(createWallet)
  }
}
export default createWalletApi
