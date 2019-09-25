import { call, put, select } from 'redux-saga/effects'
import { isNil, isEmpty } from 'ramda'
import { set } from 'ramda-lens'
import * as A from './actions'
import { KVStoreEntry } from '../../../types'
import { getMetadataXpriv } from '../root/selectors'
import { derivationMap, XLM } from '../config'
import { getKeyPair } from '../../../utils/xlm'
import { callTask } from '../../../utils/functional'

export default ({ api, networks, securityModule } = {}) => {
  const createXlm = function * ({ kv, password }) {
    const keypair = yield call(getKeyPair, securityModule, password)

    const xlm = {
      default_account_idx: 0,
      accounts: [
        {
          publicKey: keypair.publicKey(),
          label: 'My Stellar Wallet',
          archived: false
        }
      ],
      tx_notes: {}
    }
    const newkv = set(KVStoreEntry.value, xlm, kv)
    yield put(A.createMetadataXlm(newkv))
  }

  const fetchMetadataXlm = function * (secondPasswordSagaEnhancer) {
    try {
      const typeId = derivationMap[XLM]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId, networks.btc)
      yield put(A.fetchMetadataXlmLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      if (isNil(newkv.value) || isEmpty(newkv.value)) {
        yield call(secondPasswordSagaEnhancer(createXlm), { kv })
      } else {
        yield put(A.fetchMetadataXlmSuccess(newkv))
      }
    } catch (e) {
      yield put(A.fetchMetadataXlmFailure(e.message))
    }
  }

  return {
    createXlm,
    fetchMetadataXlm
  }
}
