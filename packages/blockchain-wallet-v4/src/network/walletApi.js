import Task from 'data.task'
import Either from 'data.either'
import { assoc, compose, map, identity, prop, propSatisfies, over, lensProp, is, ifElse, contains } from 'ramda'
import { mapped } from 'ramda-lens'
import Promise from 'es6-promise'
import { Wrapper, Wallet, HDWalletList, HDWallet, HDAccount } from '../types'
import { futurizeP } from 'futurize'
import createApi from './api'
import * as Coin from '../coinSelection/coin.js'

const createWalletApi = ({rootUrl, apiUrl, apiCode} = {}, returnType) => {
  // ////////////////////////////////////////////////////////////////
  const ApiPromise = createApi({rootUrl, apiUrl, apiCode})
  const eitherToTask = e => e.fold(Task.rejected, Task.of)
  const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))
  const promiseToTask = futurizeP(Task)
  const future = returnType ? futurizeP(returnType) : identity
  const is2FAEnabled = ifElse(propSatisfies(x => x > 0, 'auth_type'), Task.rejected, Task.of)
  const is2FACodeValid = ifElse(x => contains('incorrect', x), Task.rejected, Task.of)

  // ////////////////////////////////////////////////////////////////
  const fetchWalletWithSharedKeyTask = (guid, sharedKey, password) =>
    promiseToTask(ApiPromise.fetchPayloadWithSharedKey)(guid, sharedKey)
      .map(Wrapper.fromEncJSON(password))
      .chain(eitherToTask)

  const fetchWalletWithSharedKey = compose(taskToPromise, fetchWalletWithSharedKeyTask)

  // ////////////////////////////////////////////////////////////////
  const fetchWalletWithSessionTask = (guid, session, password) =>
    promiseToTask(ApiPromise.fetchPayloadWithSession)(guid, session)
      .chain(is2FAEnabled)
      .map(Wrapper.fromEncJSON(password))
      .chain(eitherToTask)

  const fetchWalletWithSession = compose(taskToPromise, fetchWalletWithSessionTask)

  // ////////////////////////////////////////////////////////////////
  const fetchWalletWithTwoFactorTask = (guid, session, password, twoFactorCode) =>
    promiseToTask(ApiPromise.fetchPayloadWithTwoFactorAuth)(guid, session, twoFactorCode)
      .chain(is2FACodeValid)
      .map(Wrapper.fromEncPayload(password))
      .chain(eitherToTask)

  const fetchWalletWithTwoFactor = compose(taskToPromise, fetchWalletWithTwoFactorTask)

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
  const saveWalletTask = wrapper =>
    eitherToTask(Wrapper.toEncJSON(wrapper))
      .chain(promiseToTask(ApiPromise.savePayload))

  const saveWallet = compose(taskToPromise, saveWalletTask)
  // ////////////////////////////////////////////////////////////////
  const createWalletTask = email => wrapper => {
    const create = w => ApiPromise.createPayload(email, w)
    return eitherToTask(Wrapper.toEncJSON(wrapper))
      .chain(promiseToTask(create))
  }
  const createWallet = (email, wrapper) => compose(taskToPromise, createWalletTask(email))(wrapper)

  // source is an account index or a legacy address
  const getWalletUnspentsTask = (coin, wrapper, source, confirmations = -1) => {
    const isBtc = coin === 'BTC'
    if (is(Number, source)) {
      const selectXpub = Either.try(
        compose(HDAccount.selectXpub, HDWallet.selectAccount(source),
          HDWalletList.selectHDWallet, Wallet.selectHdWallets, Wrapper.selectWallet))
      return eitherToTask(selectXpub(wrapper))
        .chain(xpub => promiseToTask(ApiPromise.getBitcoinUnspents)([xpub], confirmations))
        .map(prop('unspent_outputs'))
        .map(over(compose(mapped, lensProp('xpub')), assoc('index', source)))
        .map(map(Coin.fromJS))
    } else { // legacy address
      const { address, priv } = source
      return promiseToTask(ApiPromise.getBitcoinUnspents)([address], confirmations)
        .map(prop('unspent_outputs'))
        .map(over(mapped, assoc('priv', priv)))
        .map(over(mapped, assoc('address', address)))
        .map(map(Coin.fromJS))
    }
  }
  const getWalletUnspents = compose(taskToPromise, getWalletUnspentsTask)

  // ////////////////////////////////////////////////////////////////
  const Api = map(future, ApiPromise)

  return {
    ...Api,
    fetchWalletWithSharedKey: future(fetchWalletWithSharedKey),
    fetchWalletWithSession: future(fetchWalletWithSession),
    fetchWalletWithTwoFactor: future(fetchWalletWithTwoFactorTask),
    fetchWallet: future(fetchWallet),
    saveWallet: future(saveWallet),
    createWallet: future(createWallet),
    getWalletUnspents: future(getWalletUnspents),
  }
}
export default createWalletApi
