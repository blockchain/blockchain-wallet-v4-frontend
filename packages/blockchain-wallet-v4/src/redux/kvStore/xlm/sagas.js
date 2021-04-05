import { isEmpty, isNil } from 'ramda'
import { set } from 'ramda-lens'
import { call, put, select } from 'redux-saga/effects'

import { KVStoreEntry } from '../../../types'
import { callTask } from '../../../utils/functional'
import { getKeyPair } from '../../../utils/xlm'
import { getMnemonic } from '../../wallet/selectors'
import { derivationMap, XLM } from '../config'
import { getMetadataXpriv } from '../root/selectors'
import * as A from './actions'

const XLM_ACCT_NAME = 'Private Key Wallet'

export default ({ api, networks } = {}) => {
  const createXlm = function * ({ kv, password }) {
    try {
      const mnemonicT = yield select(getMnemonic, password)
      const mnemonic = yield callTask(mnemonicT)
      const keypair = yield call(getKeyPair, mnemonic)
      const xlm = {
        default_account_idx: 0,
        accounts: [
          {
            publicKey: keypair.publicKey(),
            label: XLM_ACCT_NAME,
            archived: false
          }
        ],
        tx_notes: {}
      }
      const newkv = set(KVStoreEntry.value, xlm, kv)
      yield put(A.createMetadataXlm(newkv))
    } catch (e) {
      throw new Error(
        '[NOT IMPLEMENTED] MISSING_SECOND_PASSWORD in core.createXlm saga'
      )
    }
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
        // manually update XLM account name
        newkv.value.accounts[0].label = XLM_ACCT_NAME
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
