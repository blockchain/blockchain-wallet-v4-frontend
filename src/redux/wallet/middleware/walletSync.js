import * as A from '../actions'
import * as T from '../actionTypes'

const walletSync = ({ isAuthenticated, walletPath, api } = {}) => (store) => (next) => (action) => {
  const prevWallet = store.getState()[walletPath]
  const wasAuth = isAuthenticated(store.getState())
  const result = next(action)
  const nextWallet = store.getState()[walletPath]
  const isAuth = isAuthenticated(store.getState())

  // Easily know when to sync, because of ✨immutable✨ data
  // the initial_state check could be done against full payload state

  if ((wasAuth && isAuth) &&
    action.type !== T.SET_PAYLOAD_CHECKSUM &&
    prevWallet !== nextWallet) {
    store.dispatch(A.syncStart())
    api.saveWallet(nextWallet).then(checksum => {
      store.dispatch(A.setPayloadChecksum(checksum))
      return checksum
    }).then(
      (cs) => store.dispatch(A.syncSuccess(cs))
    ).catch(
      (error) => store.dispatch(A.syncError(error))
    )
  }

  if (action.type === T.WALLET_NEW_SUCCESS) {
    const email = action.payload
    store.dispatch(A.syncStart())
    api.createWallet(email)(nextWallet).then(checksum => {
      store.dispatch(A.setPayloadChecksum(checksum))
      return checksum
    }).then(
      (cs) => store.dispatch(A.syncSuccess(cs))
    ).catch(
      (error) => store.dispatch(A.syncError(error))
    )
  }

  return result
}

export default walletSync
