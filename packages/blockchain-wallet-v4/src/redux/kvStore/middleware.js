import Task from 'data.task'
import { any, equals, identity, mapObjIndexed, sequence, values } from 'ramda'

import Remote from '../../remote'
import { kvStorePath } from '../paths'
import * as A from './actions'
import * as T from './actionTypes'
import * as C from './config'

const kvStoreMiddleware = ({
  api,
  isAuthenticated
} = {}) => store => next => action => {
  const prevKVStore = store.getState()[kvStorePath]
  const wasAuth = isAuthenticated(store.getState())
  const result = next(action)
  const nextKVStore = store.getState()[kvStorePath]
  const isAuth = isAuthenticated(store.getState())
  // this is to avoid detecting Loading/NotAsked to success changes
  const hasChanged = (value, key) =>
    prevKVStore[key] !== nextKVStore[key] && Remote.Success.is(nextKVStore[key])
  const changes = mapObjIndexed(hasChanged, nextKVStore)

  switch (true) {
    case wasAuth &&
      isAuth &&
      !any(equals(action.type), [
        T.root.FETCH_METADATA_ROOT_SUCCESS,
        T.eth.FETCH_METADATA_ETH_SUCCESS,
        T.bch.FETCH_METADATA_BCH_SUCCESS,
        T.btc.FETCH_METADATA_BTC_SUCCESS,
        T.lockbox.FETCH_METADATA_LOCKBOX_SUCCESS,
        T.userCredentials.FETCH_METADATA_USER_CREDENTIALS_SUCCESS,
        T.xlm.FETCH_METADATA_XLM_SUCCESS,
        T.walletCredentials.FETCH_METADATA_WALLET_CREDENTIALS_SUCCESS
      ]) &&
      any(identity, values(changes)):
      const actionCreators = {
        [C.ROOT]: A.root.fetchMetadataRootSuccess,
        [C.ETH]: A.eth.fetchMetadataEthSuccess,
        [C.BCH]: A.bch.fetchMetadataBchSuccess,
        [C.BTC]: A.btc.fetchMetadataBtcSuccess,
        [C.LOCKBOX]: A.lockbox.fetchMetadataLockboxSuccess,
        [C.USER_CREDENTIALS]:
          A.userCredentials.fetchMetadataUserCredentialsSuccess,
        [C.XLM]: A.xlm.fetchMetadataXlmSuccess,
        [C.WALLET_CREDENTIALS]:
          A.walletCredentials.fetchMetadataWalletCredentialsSuccess
      }

      const saveTasks = (value, key) => {
        const nextKV = nextKVStore[key].getOrElse(false)
        return value && nextKV
          ? api
              .updateKVStore(nextKV)
              .map(k => store.dispatch(actionCreators[key](k)))
          : Task.of(nextKV)
      }
      const taskObject = mapObjIndexed(saveTasks, changes)
      const syncTask = sequence(Task.of, values(taskObject))
      // eslint-disable-next-line no-console
      syncTask.fork(console.log, identity)
      break
    default:
      break
  }

  return result
}

export default kvStoreMiddleware
