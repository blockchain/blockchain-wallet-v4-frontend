import * as A from './actions'
import * as actionTypes from '../actionTypes'
import { call, put, select, take } from 'redux-saga/effects'
import { callTask } from '../../../utils/functional'
import { derivationMap, WHATSNEW } from '../config'
import { getMetadataXpriv } from '../root/selectors'
import { isEmpty, isNil } from 'ramda'
import { KVStoreEntry } from '../../../types'
import { set } from 'ramda-lens'

const whatsNewDefaultEntry = {
  lastViewed: 0,
  hasSkippedWalletTour: false
}

export default ({ api, networks }) => {
  const createWhatsNew = function * (kv) {
    const newkv = set(KVStoreEntry.value, whatsNewDefaultEntry, kv)
    yield put(A.createMetadataWhatsnew(newkv))
  }

  const fetchMetadataWhatsnew = function * () {
    try {
      const typeId = derivationMap[WHATSNEW]
      yield take(actionTypes.root.FETCH_METADATA_ROOT_SUCCESS)
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId, networks.btc)
      yield put(A.fetchMetadataWhatsnewLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      if (isNil(newkv.value) || isEmpty(newkv.value)) {
        yield call(createWhatsNew, newkv)
      } else {
        yield put(A.fetchMetadataWhatsnewSuccess(newkv))
      }
    } catch (e) {
      yield put(A.fetchMetadataWhatsnewFailure(e.message))
    }
  }

  return {
    fetchMetadataWhatsnew
  }
}
