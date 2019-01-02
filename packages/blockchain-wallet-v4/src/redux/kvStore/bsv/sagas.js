import { call, put, select } from 'redux-saga/effects'
import {
  compose,
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
import * as bsvActions from '../../data/bsv/actions'
import { KVStoreEntry } from '../../../types'
import { derivationMap, BSV } from '../config'
import { getMetadataXpriv } from '../root/selectors'
import { getHDAccounts } from '../../wallet/selectors'

const taskToPromise = t =>
  new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api, networks }) => {
  const callTask = function*(task) {
    return yield call(
      compose(
        taskToPromise,
        () => task
      )
    )
  }

  const createBsv = function*(kv, hdAccounts, bsvAccounts) {
    const createAccountEntry = x => ({
      label: `My Bitcoin SV Wallet${x > 0 ? ` ${x + 1}` : ''}`,
      archived: pathOr(false, [x, 'archived'], hdAccounts)
    })

    const newBsvEntry = {
      default_account_idx: 0,
      accounts: concat(
        bsvAccounts,
        map(createAccountEntry, range(length(bsvAccounts), hdAccounts.length))
      )
    }

    const newKv = set(KVStoreEntry.value, newBsvEntry, kv)
    yield put(A.createMetadataBsv(newKv))
    yield refetchContextData()
  }

  const fetchMetadataBsv = function*() {
    try {
      const typeId = derivationMap[BSV]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId, networks.btc)
      yield put(A.fetchMetadataBsvLoading())
      const newKv = yield callTask(api.fetchKVStore(kv))
      const hdAccounts = yield select(getHDAccounts)
      const bsvAccounts = propOr([], 'accounts', newKv.value)
      if (
        isNil(newKv.value) ||
        isEmpty(newKv.value) ||
        gt(length(hdAccounts), length(bsvAccounts))
      ) {
        return yield call(createBsv, newKv, hdAccounts, bsvAccounts)
      }
      yield put(A.fetchMetadataBsvSuccess(newKv))
    } catch (e) {
      yield put(A.fetchMetadataBsvFailure(e.message))
    }
  }

  const refetchContextData = function*() {
    yield put(bsvActions.fetchData())
  }

  return {
    fetchMetadataBsv,
    refetchContextData
  }
}
