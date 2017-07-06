import * as A from '../actions'
import * as T from '../actionTypes'
import { Wrapper } from '../../../types'

const walletSync = ({ isAuthenticated, walletPath, api } = {}) => (store) => (next) => (action) => {
  const prevWallet = store.getState()[walletPath]
  const wasAuth = isAuthenticated(store.getState())
  const result = next(action)
  const nextWallet = store.getState()[walletPath]
  const isAuth = isAuthenticated(store.getState())

  // Easily know when to sync, because of ✨immutable✨ data
  // the initial_state check could be done against full payload state

  const sync = (apiCall) => {
    store.dispatch(A.sync())
    if (Wrapper.isWrapper(nextWallet)) {
      apiCall(nextWallet).then(checksum => {
        store.dispatch(A.setPayloadChecksum(checksum))
        return checksum
      }).then(
        (cs) => store.dispatch(A.syncSuccess(cs))
      ).catch(
        (error) => store.dispatch(A.syncError(error))
      )
    } else {
      store.dispatch(A.syncError('SYNC_ERROR_NOT_A_WRAPPER'))
    }
  }

  switch (true) {
    // wallet sync
    case ((wasAuth && isAuth) &&
         action.type !== T.SET_PAYLOAD_CHECKSUM &&
         prevWallet !== nextWallet):
      sync(api.saveWallet)
      break
    // wallet creation
    case (action.type === T.CREATE_WALLET_SUCCESS ||
          action.type === T.RESTORE_WALLET_SUCCESS):
      const { email } = action.payload
      sync(api.createWallet(email))
      break
    default:
      break
  }

  return result
}

export default walletSync
