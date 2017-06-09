import { WALLET_INITIAL_STATE } from '../reducers'
import * as A from '../actions'

const walletSync = ({ wpath, api } = {}) => (store) => (next) => (action) => {
  let prevWallet = store.getState()[wpath]
  let result = next(action)
  let nextWallet = store.getState()[wpath]
  // Easily know when to sync, because of ✨immutable✨ data
  // the initial_state check could be done against full payload state

  // TODO :: refactor/simplify this middleware
  if (action.type !== A.PAYLOAD_CHECKSUM_CHANGE &&
      prevWallet.get('password') !== '' &&
      nextWallet.get('password') !== '' && // we need a logged in control here
      prevWallet.get('walletImmutable') !== WALLET_INITIAL_STATE &&
      prevWallet !== nextWallet) {
    api.saveWallet(nextWallet).then(checksum => {
      store.dispatch(A.syncStart())
      store.dispatch(A.changePayloadChecksum(checksum))
      return checksum
    }).then(
      (cs) => store.dispatch(A.syncSuccess(cs))
    ).catch(
      (error) => store.dispatch(A.syncError(error))
    )
  }

  if (action.type === A.WALLET_NEW_SET && prevWallet !== nextWallet) { // wallet signup
    const { email } = action.payload
    api.createWallet(email)(nextWallet).then(checksum => {
      store.dispatch(A.syncStart())
      store.dispatch(A.changePayloadChecksum(checksum))
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
