import { futurizeP } from 'futurize'
import Task from 'data.task'
import {
  compose,
  assoc,
  join,
  curry,
  range,
  keysIn,
  isNil,
  pluck,
  filter,
  propEq,
  uniq
} from 'ramda'
import { networks } from 'bitcoinjs-lib'

import * as A from '../actions'
import * as T from '../actionTypes'
import { Wrapper, Wallet, HDAccount } from '../../types'
import * as selectors from '../selectors'

/**
 * Number of addresses for each HD Account to sync with platform
 * This includes labeled addresses and future ones
 * Labaled addreses have higher priority
 */
export const addressLookaheadCount = 10

export const toAsync = fn =>
  new Promise(resolve => setTimeout(() => resolve(fn()), 0))

/**
 * Launches derivation of future addresses for target HDAccount
 * @curried
 * @param {any} state redux state
 * @param {HDAccount.HDAccount} account
 * @returns {Promise<String>[]} array of promises, each of them resolves into address
 */
export const getHDAccountAddressPromises = curry((state, account) => {
  const xpub = selectors.wallet.getAccountXpub(account.index, state)

  /**
   * Get each address within separate event queue entry
   * in order to unblock the UI during heavy scripting
   * setTimeout runs infrequently and is less blocking
   * requestAnimation frame blocks UI heavier
   */
  const asyncDerive = index =>
    toAsync(() =>
      HDAccount.getReceiveAddress(account, index, networks.bitcoin.NETWORK_BTC)
    )

  const receiveIndex = selectors.data.btc
    .getReceiveIndex(xpub, state)
    .getOrElse(null)
  if (isNil(receiveIndex)) return []

  return range(receiveIndex, receiveIndex + addressLookaheadCount).map(
    asyncDerive
  )
})

/**
 * getWalletAddresses :: (state, api) -> Promise<String[]>
 */
export const getUnusedLabeledAddresses = async (state, api) => {
  const labeledAddresses = await api.fetchBlockchainData(
    selectors.kvStore.btc.getAddressLabelKeys(state)
  )
  return compose(
    pluck('address'),
    filter(propEq('n_tx', 0))
  )(labeledAddresses.addresses)
}

/**
 * Collects all of the wallet active addresses:
 *   regular, hd and labeled
 * getWalletAddresses :: (state, api) -> Promise<String[]>
 */
export const getWalletAddresses = async (state, api) => {
  const activeAddresses = keysIn(selectors.wallet.getActiveAddresses(state))
  const hdAccounts = compose(
    Wallet.selectHDAccounts,
    selectors.wallet.getWallet
  )(state)
  const [unusedAddresses, ...hdAddresses] = await Promise.all([
    getUnusedLabeledAddresses(state, api),
    ...hdAccounts.flatMap(getHDAccountAddressPromises(state)).toJS()
  ])

  return activeAddresses.concat(uniq(hdAddresses.concat(unusedAddresses)))
}

/**
 * Wallet sync middleware
 * Calls sync on special conditions
 *
 * TODO: refactor to sagas, VERY painful to test/write mocks
 */
const walletSync = ({
  isAuthenticated,
  api,
  mergeWrapper = false
} = {}) => store => next => action => {
  const prevState = store.getState()
  const prevWallet = selectors.wallet.getWrapper(prevState)
  const wasAuth = isAuthenticated(prevState)
  const result = next(action)

  const state = store.getState()
  const nextWallet = selectors.wallet.getWrapper(state)
  const syncPubKeys = selectors.wallet.shouldSyncPubKeys(state)
  const isAuth = isAuthenticated(state)
  const promiseToTask = futurizeP(Task)

  // Easily know when to sync, because of ✨immutable✨ data
  // the initial_state check could be done against full payload state

  const handleChecksum = encrypted => {
    const checksum = Wrapper.computeChecksum(encrypted)
    compose(
      store.dispatch,
      A.wallet.setPayloadChecksum
    )(checksum)
    return encrypted
  }

  const sync = async () => {
    let encryptedWallet = Wrapper.toEncJSON(nextWallet)
    if (syncPubKeys) {
      /**
       * To get notifications working you have to add list of lookahead addresses
       * For each of the wallet's accounts
       */
      try {
        const addresses = await getWalletAddresses(state, api)
        encryptedWallet = encryptedWallet.map(
          assoc('active', join('|', addresses))
        )
      } catch (error) {
        return store.dispatch(A.walletSync.syncError(error))
      }
    }
    return encryptedWallet
      .map(handleChecksum)
      .chain(promiseToTask(api.savePayload))
      .fork(
        compose(
          store.dispatch,
          A.walletSync.syncError
        ),
        compose(
          store.dispatch,
          A.walletSync.syncSuccess
        )
      )
  }

  switch (true) {
    case action.type === T.walletSync.FORCE_SYNC:
    case wasAuth &&
      isAuth &&
      action.type !== T.wallet.SET_PAYLOAD_CHECKSUM &&
      action.type !== T.wallet.REFRESH_WRAPPER &&
      prevWallet !== nextWallet:
      if (mergeWrapper) {
        store.dispatch(A.wallet.mergeWrapper(nextWallet))
      } else {
        sync()
      }
      break
    default:
      break
  }

  return result
}

export default walletSync
