import { call, put, select } from 'redux-saga/effects'
import {
  concat,
  gt,
  isNil,
  length,
  map,
  pathOr,
  propOr,
  range,
  isEmpty
} from 'ramda'
import { set } from 'ramda-lens'
import * as A from './actions'
import * as bchActions from '../../data/bch/actions'
import { KVStoreEntry } from '../../../types'
import { derivationMap, BCH } from '../config'
import { getMetadataXpriv } from '../root/selectors'
import { getHDAccounts } from '../../wallet/selectors'
import { callTask } from '../../../utils/functional'

export default ({ api, networks }) => {
  const createBch = function*(kv, hdAccounts, bchAccounts) {
    const createAccountEntry = x => ({
      label: `My Bitcoin Cash Wallet${x > 0 ? ` ${x + 1}` : ''}`,
      archived: pathOr(false, [x, 'archived'], hdAccounts)
    })

    const newBchEntry = {
      default_account_idx: 0,
      accounts: concat(
        bchAccounts,
        map(createAccountEntry, range(length(bchAccounts), hdAccounts.length))
      )
    }

    const newkv = set(KVStoreEntry.value, newBchEntry, kv)
    yield put(A.createMetadataBch(newkv))
    yield put(bchActions.fetchData())
  }

  const fetchMetadataBch = function*() {
    try {
      const typeId = derivationMap[BCH]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId, networks.btc)
      yield put(A.fetchMetadataBchLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      const hdAccounts = yield select(getHDAccounts)
      const bchAccounts = propOr([], 'accounts', newkv.value)
      if (
        isNil(newkv.value) ||
        isEmpty(newkv.value) ||
        gt(length(hdAccounts), length(bchAccounts))
      ) {
        return yield call(createBch, newkv, hdAccounts, bchAccounts)
      }
      yield put(A.fetchMetadataBchSuccess(newkv))
    } catch (e) {
      yield put(A.fetchMetadataBchFailure(e.message))
    }
  }

  return {
    createBch,
    fetchMetadataBch
  }
}
