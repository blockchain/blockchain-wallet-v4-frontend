import { call, put, select } from 'redux-saga/effects'
import { compose, isNil } from 'ramda'
import { set } from 'ramda-lens'
import * as A from './actions'
import { KVStoreEntry } from '../../../types'
import { derivationMap, BTC } from '../config'
import { getMetadataXpriv } from '../root/selectors'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api }) => {
  const callTask = function * (task) {
    return yield call(compose(taskToPromise, () => task))
  }
  
  const createBtc = function * (kv) {
    const newBtcEntry = {
    }
    //const accounts = Wallet.selectHDAccounts(payload.wallet)
    //
    //let addressLabels = accounts.map((account) => {
    //  const hd = accounts.get(account.index)
    //  return account.address_labels.map((label) => ({
    //    address: HDAccount.getReceiveAddress(hd, label.index),
    //    label: label.label,
    //    index: label.index
    //  }))
    //}).flatten().toArray()
    //
    //for (let i in addressLabels) {
    //  yield put(actions.data.bitcoin.addAddressLabel(addressLabels[i].address, addressLabels[i].label))
    //}

    const newkv = set(KVStoreEntry.value, newBtcEntry, kv)
    yield put(A.createMetadataBtc(newkv))
    yield refetchContextData()
  }
  
  const fetchMetadataBtc = function * () {
    try {
      const typeId = derivationMap[BTC]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId)
      yield put(A.fetchMetadataBtcLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      if (isNil(newkv.value)) {
        return yield call(createBtc, newkv)
      }
      yield put(A.fetchMetadataBtcSuccess(newkv))
    } catch (e) {
      yield put(A.fetchMetadataBtcFailure(e.message))
    }
  }
  
  const refetchContextData = function * () {
    yield put(A.fetchData())
  }
  
  return {
    fetchMetadataBtc,
    refetchContextData
  }
}
