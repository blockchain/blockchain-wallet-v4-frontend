import * as A from './actions'
import { call, put, select } from 'redux-saga/effects'
import { callTask } from '../../../utils/functional'
import { derivationMap, WALLET_CREDENTIALS } from '../config'
// import { getKeyPair } from '../../../utils/walletCredentials'
import { getMetadataXpriv } from '../root/selectors'
import * as selectors from '../../selectors'
import { getMnemonic } from '../../wallet/selectors'
import { compose, isEmpty, isNil } from 'ramda'
import { KVStoreEntry } from '../../../types'
import { set } from 'ramda-lens'
import BIP39 from 'bip39'
import Bitcoin from 'bitcoinjs-lib'
import Task from 'data.task'
import * as KV from '../../../types/KVStoreEntry'

export default ({ api, networks } = {}) => {

  const createWalletCredentials = function * (kv) {
    const guidT = yield select(selectors.wallet.getGuid)
    const passwordT = yield select(selectors.wallet.getMainPassword)
    const sharedKeyT = yield select(selectors.wallet.getSharedKey)
    const newkv = set(KVStoreEntry.value, { guid: guidT, password: passwordT, sharedKey: sharedKeyT }, kv)
    // Only update the value in metadata if it's out-of-sync with the actual credentials
    // or when we haven't written it yet
    if(kv.value) {
      const { guid, password, sharedKey } = kv.value
      if(guid !== guidT || password !== passwordT || sharedKey !== sharedKeyT) {
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
      yield call(createWalletCredentials, newkv)
    } catch (e) {
      console.info(e)
      yield put(A.fetchMetadataWalletCredentialsFailure(e.message))
    }
  }

  return {
    createWalletCredentials,
    fetchMetadataWalletCredentials
  }
}
