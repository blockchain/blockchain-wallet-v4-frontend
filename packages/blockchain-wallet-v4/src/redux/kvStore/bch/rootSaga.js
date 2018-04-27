
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { append, compose, concat, gt, isNil, length, lift, map, path, range } from 'ramda'
import { set } from 'ramda-lens'
import * as A from './actions'
import * as AT from './actionTypes'
import { KVStoreEntry } from '../../../types'
import { getMetadataXpriv } from '../root/selectors'
import { getHDAccounts } from '../../wallet/selectors'
import { getAccountsList } from './selectors'
import { derivationMap, BCH } from '../config'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

const createAccountEntry = (index) => {
  return {
    label: `My Bitcoin Cash Wallet${index > 0 ? ` ${index + 1}` : ''}`,
    archived: false
  }
}

export default ({ api }) => {
  const callTask = function * (task) {
    return yield call(compose(taskToPromise, () => task))
  }

  const createBch = function * (kv, hdAccounts, bchAccounts, bchDefaultAccount) {
    const newBchAccounts = map(createAccountEntry, range(length(bchAccounts), length(hdAccounts)))
    const newBchEntry = {
      default_account_idx: bchAccounts || 0,
      accounts: concat(bchAccounts, newBchAccounts)
    }

    const newkv = set(KVStoreEntry.value, newBchEntry, kv)
    yield put(A.createMetadataBch(newkv))
  }

  const fetchMetadataBch = function * () {
    try {
      const typeId = derivationMap[BCH]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId)
      yield put(A.fetchMetadataBchLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      const hdAccounts = yield select(getHDAccounts)
      const bchAccounts = path(['value', 'accounts'], newkv) || []
      const bchDefaultAccount = path(['value', 'default_account_idx'], newkv)
      if (isNil(newkv.value) || gt(length(hdAccounts), length(bchAccounts))) {
        yield call(createBch, newkv, hdAccounts, bchAccounts, bchDefaultAccount)
      }
      yield put(A.fetchMetadataBchSuccess(newkv))
    } catch (e) {
      yield put(A.fetchMetadataBchFailure(e.message))
    }
  }

  const addBchAccount = function * () {
    try {
      const bchAccounts = yield select(getAccountsList)
      const newEntryIndex = length(bchAccounts.getOrElse([]))
      const newEntry = createAccountEntry(newEntryIndex)
      const allBchAccounts = lift(append(newEntry))(bchAccounts).getOrElse(bchAccounts)
      yield put(A.addBchAccountComplete(allBchAccounts))
    } catch (e) {
      throw new Error('Could not add new BCH account')
    }
  }

  return function * () {
    yield takeLatest(AT.FETCH_METADATA_BCH, fetchMetadataBch)
    yield takeLatest(AT.ADD_BCH_ACCOUNT, addBchAccount)
  }
}
