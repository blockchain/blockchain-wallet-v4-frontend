import { futurizeP } from 'futurize'
import Task from 'data.task'
import { compose } from 'ramda'

import * as A from '../actions'
import * as T from '../actionTypes'
import { Wrapper } from '../../types'
import * as selectors from '../selectors'

const walletSync = ({ isAuthenticated, api } = {}) => (store) => (next) => (action) => {
  const prevWallet = selectors.wallet.getWrapper(store.getState())
  const wasAuth = isAuthenticated(store.getState())
  const result = next(action)
  const nextWallet = selectors.wallet.getWrapper(store.getState())
  const isAuth = isAuthenticated(store.getState())
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
