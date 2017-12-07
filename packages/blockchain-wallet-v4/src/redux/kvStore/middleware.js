import { mapObjIndexed, any, identity, values, sequence } from 'ramda'
import Task from 'data.task'

// import { Wallet, KVStoreEntry } from '../../types'
import * as A from './actions'
import * as T from './actionTypes'
import * as C from './config'

const kvStoreMiddleware = ({ isAuthenticated, kvStorePath, api } = {}) => (store) => (next) => (action) => {
  const prevKVStore = store.getState()[kvStorePath]
  const wasAuth = isAuthenticated(store.getState())
  const result = next(action)
  const nextKVStore = store.getState()[kvStorePath]
  const isAuth = isAuthenticated(store.getState())
  const hasChanged = (value, key) => prevKVStore[key] !== nextKVStore[key]
  const changes = mapObjIndexed(hasChanged, nextKVStore)

  switch (true) {
    case (wasAuth && isAuth &&
          action.type !== T.whatsNew.SET_WHATS_NEW &&
          action.type !== T.buySell.SET_BUYSELL &&
          action.type !== T.contacts.SET_CONTACTS &&
          action.type !== T.ethereum.SET_ETHEREUM &&
          action.type !== T.shapeShift.SET_SHAPESHIFT &&
          any(identity, values(changes))):

      const actionCreators = {
        // [GUID]: 0,
        [C.WHATSNEW]: A.whatsNew.setWhatsNew,
        [C.BUYSELL]: A.buySell.setBuySell,
        [C.CONTACTS]: A.contacts.setContacts,
        [C.ETHEREUM]: A.ethereum.setEthereum,
        [C.SHAPESHIFT]: A.shapeShift.setShapeShift
      }
      // need to be improved: when copy is out of sync it fails with {message: 'Unauthorized'}
      // we have to handle failure with fetch and redispatch of the original action
      const saveTasks = (value, key) => value
        ? api.updateKVStore(nextKVStore[key]).map(k => store.dispatch(actionCreators[key](k)))
        : Task.of(nextKVStore[key])
      const taskObject = mapObjIndexed(saveTasks, changes)
      const syncTask = sequence(Task.of, values(taskObject))
      // waiting to see what notification system we use (maybe action required)
      syncTask.fork(console.log, identity)
      break
    default:
      break
  }

  return result
}

export default kvStoreMiddleware
