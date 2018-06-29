import { futurizeP } from 'futurize'
import Task from 'data.task'
import { compose, assoc, join, pipe, curry, map, range,
  identity, converge, add, keysIn } from 'ramda'
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

/**
 * Launches derivation of future addresses for target HDAccount
 * @curried
 * @param {any} state redux state
 * @param {HDAccount.HDAccount} account
 * @returns {Promise<String>[]} array of promises, each of them resolves into address
 */
export const getHDAccountAddressPromises = curry((state, account) => {
  const xpub = selectors.wallet.getAccountXpub(account.index, state)
  return selectors.data.bitcoin.getReceiveIndex(xpub, state)
    .map(pipe(
      /**
       * Get the range of address indexes
       * (receiveIndex, receiveIndex + unusedAddressesCount)
       */
      converge(range, [identity, add(unusedAddressesCount)]),

      /**
       * Get each address within separate event queue entry
       * in order to unblock the UI during heavy scripting
       * setTimeout runs infrequently and is less blocking
       * requestAnimation frame blocks UI heavier
       */
      map((index) => new Promise((resolve) => setTimeout(() =>
        resolve(
          HDAccount.getReceiveAddress(
            account,
            index,
            networks.bitcoin.NETWORK_BITCOIN
          )
        ), 0)
      ))
    ))
    .getOrElse([])
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
  const isAuth = isAuthenticated(state)
  const promiseToTask = futurizeP(Task)

  // Easily know when to sync, because of ✨immutable✨ data
  // the initial_state check could be done against full payload state

  const handleChecksum = encrypted => {
    const checksum = Wrapper.computeChecksum(encrypted)
    compose(store.dispatch, A.wallet.setPayloadChecksum)(checksum)
    return encrypted
  }

  const sync = async (apiCall) =>
    Wrapper.toEncJSON(nextWallet)
      /**
       * To get notifications working you have to add list of unused addresses
       * For each of the wallet's accounts
       */
      .map(assoc('active', join('|', await getWalletAddresses(state))))
      .map(handleChecksum)
      .chain(promiseToTask(apiCall))
      .fork(
        compose(store.dispatch, A.walletSync.syncError),
        compose(store.dispatch, A.walletSync.syncSuccess))

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
