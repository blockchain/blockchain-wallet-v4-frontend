import { set } from 'ramda-lens'
import { call, put, select } from 'redux-saga/effects'

import { KVStoreEntry } from '../../../types'
import { callTask } from '../../../utils/functional'
import * as selectors from '../../selectors'
import { derivationMap, WALLET_CREDENTIALS } from '../config'
import { getMetadataXpriv } from '../root/selectors'
import * as A from './actions'

export default ({ api, networks } = {}) => {
  // internal
  const updateWalletCredentialsIfChangedOrMissing = function * (kv) {
    const guidT = yield select(selectors.wallet.getGuid)
    const passwordT = yield select(selectors.wallet.getMainPassword)
    const sharedKeyT = yield select(selectors.wallet.getSharedKey)
    const newkv = set(
      KVStoreEntry.value,
      { guid: guidT, password: passwordT, sharedKey: sharedKeyT },
      kv
    )
    // Only update the value in metadata if it's out-of-sync with the actual credentials
    // or when we haven't written it yet
    if (kv.value) {
      const { guid, password, sharedKey } = kv.value
      if (
        guid !== guidT ||
        password !== passwordT ||
        sharedKey !== sharedKeyT
      ) {
        yield put(A.createMetadataWalletCredentials(newkv))
      }
    } else {
      yield put(A.createMetadataWalletCredentials(newkv))
    }
  }

  const fetchMetadataWalletCredentials = function * () {
    try {
      const typeId = derivationMap[WALLET_CREDENTIALS]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId, networks.btc)
      yield put(A.fetchMetadataWalletCredentialsLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      yield call(updateWalletCredentialsIfChangedOrMissing, newkv)
    } catch (e) {
      yield put(A.fetchMetadataWalletCredentialsFailure(e.message))
    }
  }

  return {
    fetchMetadataWalletCredentials
  }
}
