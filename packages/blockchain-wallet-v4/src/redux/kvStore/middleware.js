import { combineReducers } from 'redux'
import { keys, compose, zip, over } from 'ramda'

import { Wallet, KVStoreEntry } from '../../types'
import * as A from '../actions'
import * as T from '../actionTypes'

// export const kvReducerEnhancer = (typeId, reducer) => (state = KVStoreEntry.createEmpty(typeId), action) => {
//   let { type, payload } = action
//   if (type === KV_SYNC && payload.typeId === typeId) {
//     return payload
//   }
//   return over(KVStoreEntry.value, (value) => reducer(value, action), state)
// }

// const kvStoreMiddleware = (reducers, { api, path, walletPath, serialize = JSON.stringify } = {}) => {
//   let keyPaths = keys(reducers)
//   let select = (state) => (keyPath) => state[path][keyPath]

//   let reducer = () => combineReducers(reducers)

//   let middleware = () => (store) => (next) => (action) => {
//     let prevs = keyPaths.map(select(store.getState()))
//     let result = next(action)
//     let currs = keyPaths.map(select(store.getState()))
//     let zipped = zip(prevs, currs)

//     let wallet = store.getState()[walletPath].get('walletImmutable')

//     if (!wallet || !wallet.guid || action.type === KV_SYNC) {
//       return result
//     }

//     let hd = Wallet.selectHdWallet(wallet)

//     let run = (task) => task.fork(
//       (e) => console.log('error:', e),
//       compose(store.dispatch, syncKv)
//     )

//     zipped.forEach(([p, c]) => {
//       if (c.magicHash === void 0) {
//         let kv = KVStoreEntry.fromHdWallet(hd, c.typeId)
//         run(api.fetch(kv))
//       } else if (serialize(p.value) !== serialize(c.value)) {
//         run(api.update(c))
//       }
//     })

//     return result
//   }

//   return {
//     reducer,
//     middleware
//   }
// }



const kvStoreMiddleware = ({ isAuthenticated, walletPath, kvPath, api } = {}) => (store) => (next) => (action) => {
  // const prevWallet = store.getState()[walletPath]
  const wasAuth = isAuthenticated(store.getState())
  const result = next(action)
  // const nextWallet = store.getState()[walletPath]
  const isAuth = isAuthenticated(store.getState())

  // Easily know when to sync, because of ✨immutable✨ data
  // the initial_state check could be done against full payload state

  // const sync = (apiCall) => {
  //   store.dispatch(A.walletSync.sync())
  //   if (Wrapper.isWrapper(nextWallet)) {
  //     apiCall(nextWallet).then(checksum => {
  //       store.dispatch(A.wallet.setPayloadChecksum(checksum))
  //       return checksum
  //     }).then(
  //       (cs) => store.dispatch(A.walletSync.syncSuccess(cs))
  //     ).catch(
  //       (error) => store.dispatch(A.walletSync.syncError(error))
  //     )
  //   } else {
  //     store.dispatch(A.walletSync.syncError('SYNC_ERROR_NOT_A_WRAPPER'))
  //   }
  // }

  switch (true) {
    // wallet sync
    case ((wasAuth && isAuth) // &&
        //  action.type !== T.wallet.SET_PAYLOAD_CHECKSUM &&
        //  prevWallet !== nextWallet
      ):
      console.log('is authenticated')
      // sync(api.saveWallet)
      break
    // wallet creation
    // case (
    //       action.type === T.wallet.CREATE_WALLET_SUCCESS ||
    //       action.type === T.wallet.RESTORE_WALLET_SUCCESS):
    //   console.log('create wallet')
      // const { email } = action.payload
      // sync(api.createWallet(email))
      // break
    default:
      break
  }

  return result
}

export default kvStoreMiddleware
