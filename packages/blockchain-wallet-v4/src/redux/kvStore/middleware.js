import { mapObjIndexed, any, identity, values, sequence } from 'ramda'
import Task from 'data.task'

// import { Wallet, KVStoreEntry } from '../../types'
import * as A from './actions'
import * as T from './actionTypes'
import * as C from './config'
import { kvStorePath } from '../paths'
import Remote from '../../remote'

const kvStoreMiddleware = ({ isAuthenticated, api } = {}) => (store) => (next) => (action) => {
  const prevKVStore = store.getState()[kvStorePath]
  const wasAuth = isAuthenticated(store.getState())
  const result = next(action)
  const nextKVStore = store.getState()[kvStorePath]
  const isAuth = isAuthenticated(store.getState())
  const hasChanged = (value, key) =>
    prevKVStore[key] !== nextKVStore[key] &&
    // Remote.Success.is(prevKVStore[key]) &&
    Remote.Success.is(nextKVStore[key]) // this is to avoid detecting loading/notasked to success changes
  const changes = mapObjIndexed(hasChanged, nextKVStore)

  switch (true) {
    case (wasAuth && isAuth &&
          action.type !== T.root.FETCH_METADATA_ROOT_SUCCESS &&
          action.type !== T.whatsNew.FETCH_METADATA_WHATSNEW_SUCCESS &&
          action.type !== T.buySell.FETCH_METADATA_BUYSELL_SUCCESS &&
          action.type !== T.contacts.FETCH_METADATA_CONTACTS_SUCCESS &&
          action.type !== T.ethereum.FETCH_METADATA_ETHEREUM_SUCCESS &&
          action.type !== T.shapeShift.FETCH_METADATA_SHAPESHIFT_SUCCESS &&
          action.type !== T.bch.FETCH_METADATA_BCH_SUCCESS &&
          any(identity, values(changes))):

      const actionCreators = {
        [C.ROOT]: A.root.fetchMetadataRootSuccess,
        [C.WHATSNEW]: A.whatsNew.fetchMetadataWhatsnewSuccess,
        [C.BUYSELL]: A.buySell.fetchMetadataBuySellSuccess,
        [C.CONTACTS]: A.contacts.fetchMetadataContactsSuccess,
        [C.ETHEREUM]: A.ethereum.fetchMetadataEthereumSuccess,
        [C.SHAPESHIFT]: A.shapeShift.fetchMetadataShapeshiftSuccess,
        [C.BCH]: A.bch.fetchMetadataBchSuccess
      }

      const saveTasks = (value, key) => {
        const nextKV = nextKVStore[key].getOrElse(false)
        return value && nextKV
          ? api.updateKVStore(nextKV).map(k => store.dispatch(actionCreators[key](k)))
          : Task.of(nextKV)
      }
      const taskObject = mapObjIndexed(saveTasks, changes)
      const syncTask = sequence(Task.of, values(taskObject))
      syncTask.fork(console.log, identity)
      break
    default:
      break
  }

  return result
}

export default kvStoreMiddleware
