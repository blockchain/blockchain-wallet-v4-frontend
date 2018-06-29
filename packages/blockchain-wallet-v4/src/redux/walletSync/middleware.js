import { futurizeP } from 'futurize'
import Task from 'data.task'
import { compose, assoc, join, curry, range, keysIn } from 'ramda'
import { networks } from 'bitcoinjs-lib'

import * as A from '../actions'
import * as T from '../actionTypes'
import { Wrapper, Wallet, HDAccount } from '../../types'
import * as selectors from '../selectors'

/**
 * Number of unused addresses for each HD Account
 * to sync with platform
 */
export const unusedAddressesCount = 10

export const toAsync = (fn) => new Promise(
  (resolve) => setTimeout(() => resolve(fn()), 0)
)

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
  const asyncDerive = index => toAsync(() =>
    HDAccount.getReceiveAddress(account, index, networks.bitcoin.NETWORK_BITCOIN))
  return selectors.data.bitcoin.getReceiveIndex(xpub, state)
    .map((receiveIndex) => range(receiveIndex, receiveIndex + unusedAddressesCount))
    .getOrElse([])
    .map(asyncDerive)
})

/**
 * Derives wallet's unused addresses
 * @param {any} state redux state
 * @returns {Promise<String[]>} unused wallet addresses
 */
export const getWalletAddresses = async state => {
  const activeAddresses = keysIn(selectors.wallet.getActiveAddresses(state))
  const hdAccounts = compose(Wallet.selectHDAccounts, selectors.wallet.getWallet)(state)
  const hdAddresses = await Promise.all(
    hdAccounts
      .flatMap(getHDAccountAddressPromises(state))
      .toJS()
  )

  return activeAddresses.concat(hdAddresses)
}

/**
 * Wallet sync middleware
 * Calls sync on special conditions
 *
 * TODO: refactor to sagas, VERY painful to test/write mocks
 */
const walletSync = ({ isAuthenticated, api } = {}) => (store) => (next) => (action) => {
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
    compose(store.dispatch, A.wallet.setPayloadChecksum)(checksum)
    return encrypted
  }

  const sync = async (apiCall) => {
    let encryptedWallet = Wrapper.toEncJSON(nextWallet)
    if (syncPubKeys) {
      /**
       * To get notifications working you have to add list of unused addresses
       * For each of the wallet's accounts
       */
      const addresses = await getWalletAddresses(state)
      encryptedWallet = encryptedWallet.map(assoc('active', join('|', addresses)))
    }
    return encryptedWallet
      .map(handleChecksum)
      .chain(promiseToTask(apiCall))
      .fork(
        compose(store.dispatch, A.walletSync.syncError),
        compose(store.dispatch, A.walletSync.syncSuccess))
  }

  switch (true) {
    case (action.type === T.walletSync.FORCE_SYNC):
    case (wasAuth && isAuth &&
         action.type !== T.wallet.SET_PAYLOAD_CHECKSUM &&
         action.type !== T.wallet.REFRESH_WRAPPER &&
         prevWallet !== nextWallet):
      sync(api.savePayload)
      break
    default:
      break
  }

  return result
}

export default walletSync
