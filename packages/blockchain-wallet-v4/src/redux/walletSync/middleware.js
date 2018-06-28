import { futurizeP } from 'futurize'
import Task from 'data.task'
import { compose, assoc, join, pipe, curry, map, range, identity, converge, add, keysIn } from 'ramda'
import { networks } from 'bitcoinjs-lib'

import * as A from '../actions'
import * as T from '../actionTypes'
import { Wrapper, HDAccount, Wallet } from '../../types'
import * as selectors from '../selectors'

const getHDAccountAddresses = curry((state, account) => {
  const xpub = selectors.wallet.getAccountXpub(account.index, state)
  return selectors.data.bitcoin.getReceiveIndex(xpub, state)
    .map(pipe(
      converge(range, [identity, add(20)]),
      map((index) => HDAccount.getReceiveAddress(
        account,
        index,
        networks.bitcoin.NETWORK_BITCOIN
      ))
    ))
    .getOrElse([])
})

const getWalletAddresses = state => {
  const activeAddresses = keysIn(selectors.wallet.getActiveAddresses(state))
  const hdAccounts = compose(Wallet.selectHDAccounts, selectors.wallet.getWallet)(state)
  const hdAddresses = hdAccounts.flatMap(getHDAccountAddresses(state)).toJS()

  return activeAddresses.concat(hdAddresses)
}

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

  const sync = (apiCall) =>
    Wrapper.toEncJSON(nextWallet)
      .map(assoc('active', join('|', getWalletAddresses(state))))
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
