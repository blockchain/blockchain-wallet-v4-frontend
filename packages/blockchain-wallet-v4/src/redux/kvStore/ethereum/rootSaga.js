
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { compose, isNil } from 'ramda'
import { set } from 'ramda-lens'
import * as A from './actions'
import * as AT from './actionTypes'
import { KVStoreEntry } from '../../../types'
import { getMetadataXpriv } from '../root/selectors'
import { derivationMap, ETHEREUM } from '../config'
import * as eth from '../../../utils/ethereum'
import { getMnemonic } from '../../wallet/selectors'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api }) => {
  const callTask = function * (task) {
    return yield call(compose(taskToPromise, () => task))
  }

  const createEthereum = function * ({ kv, password }) {
    // TODO :: find a way to make the second password arrive this point if needed
    const mnemonic = state => getMnemonic(state, password)
    const eitherMnemonic = yield select(mnemonic)
    if (eitherMnemonic.isRight) {
      const mnemonic = eitherMnemonic.value
      const defaultIndex = 0
      const addr = eth.deriveAddress(mnemonic, defaultIndex)
      const ethereum = {
        has_seen: true,
        default_account_index: defaultIndex,
        accounts: [{
          label: 'My Ether Wallet',
          archived: false,
          correct: true,
          addr
        }],
        legacy_account: {},
        tx_notes: {},
        last_tx: undefined
      }
      const newkv = set(KVStoreEntry.value, {ethereum}, kv)
      yield put(A.createMetadataEthereum(newkv))
    } else {
      throw new Error('[NOT IMPLEMENTED] MISSING_SECOND_PASSWORD in core.createEthereum saga')
    }
  }

  const fetchMetadataEthereum = function * () {
    // TODO:
    // - Ether creation should handle sweep legacy account
    // - Handle when second password is on (maybe the frontend needs to create a saga wrapping the fetchMetadataEther to use the saga enhancer)
    // - handle the has_seen or how to show the welcome ethereum modal. Maybe we should question this workflow and do like android, just create the wallet
    try {
      const typeId = derivationMap[ETHEREUM]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId)
      yield put(A.fetchMetadataEthereumLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      if (isNil(newkv.value)) { // handle has_seen: false ??
        yield call(createEthereum, { kv })
      } else {
        yield put(A.fetchMetadataEthereumSuccess(newkv))
      }
    } catch (e) {
      yield put(A.fetchMetadataEthereumFailure(e.message))
    }
  }

  return function * () {
    yield takeLatest(AT.FETCH_METADATA_ETHEREUM, fetchMetadataEthereum)
  }
}
