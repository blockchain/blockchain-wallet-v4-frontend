import { isEmpty, isNil, path } from 'ramda'
import { set } from 'ramda-lens'
import { call, put, select } from 'redux-saga/effects'

import { Derivation, HDAccount, KVStoreEntry } from '../../../types'
import { callTask } from '../../../utils/functional'
import { derivationMap, LOCKBOX } from '../config'
import { getMetadataXpriv } from '../root/selectors'
import * as A from './actions'

export default ({ api, networks }) => {
  const createLockbox = function * (kv) {
    const newLockboxEntry = {
      devices: [],
      version: 4
    }
    const newkv = set(KVStoreEntry.value, newLockboxEntry, kv)
    yield put(A.createMetadataLockbox(newkv))
  }

  const upgradeLockboxV4 = function * (kv) {
    try {
      let upgradedDevices = kv.value.devices.map(d => {
        const BtcXpub = path(['btc', 'accounts', 0, 'xpub'], d)
        const BtcLabel = path(['btc', 'accounts', 0, 'label'], d)
        const BchXpub = path(['bch', 'accounts', 0, 'xpub'], d)
        const BchLabel = path(['bch', 'accounts', 0, 'label'], d)
        const btcAccount = HDAccount.js(
          BtcLabel,
          [Derivation.js('legacy', 44, null, BtcXpub)],
          'legacy'
        )
        const bchAccount = HDAccount.js(
          BchLabel,
          [Derivation.js('bch-145', 145, null, BchXpub)],
          'bch-145'
        )

        return {
          ...d,
          btc: {
            accounts: [btcAccount]
          },
          bch: {
            accounts: [bchAccount]
          }
        }
      })

      kv.value.devices = upgradedDevices
      kv.value.version = 4
      yield put(A.fetchMetadataLockboxSuccess(kv))
    } catch (e) {
      yield put(A.fetchMetadataLockboxFailure(e.message))
    }
  }

  const fetchMetadataLockbox = function * () {
    try {
      const typeId = derivationMap[LOCKBOX]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId, networks.btc)
      yield put(A.fetchMetadataLockboxLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      if (isNil(newkv.value) || isEmpty(newkv.value)) {
        yield call(createLockbox, newkv)
      } else {
        if (!newkv.value.version) {
          yield call(upgradeLockboxV4, newkv)
        }
        yield put(A.fetchMetadataLockboxSuccess(newkv))
      }
    } catch (e) {
      yield put(A.fetchMetadataLockboxFailure(e.message))
      return -1
    }
  }

  return {
    createLockbox,
    fetchMetadataLockbox
  }
}
