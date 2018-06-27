import { call, put, select, fork } from 'redux-saga/effects'
import { compose, isNil } from 'ramda'
import { delay } from 'redux-saga'
import { set } from 'ramda-lens'
import * as A from './actions'
import { KVStoreEntry, HDAccount, Wallet } from '../../../types'
import { derivationMap, BTC } from '../config'
import { getMetadataXpriv } from '../root/selectors'
import { getWallet } from '../../wallet/selectors'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api }) => {
  const callTask = function * (task) {
    return yield call(compose(taskToPromise, () => task))
  }

  const createMetadataBtc = function * () {
    yield call(delay, 1000)
    const addressLabels = {
    }

    const wallet = yield select(getWallet)
    const accounts = Wallet.selectHDAccounts(wallet)

    accounts.map((account) => {
      const hd = accounts.get(account.index)
      account.address_labels.map((label) => {
        addressLabels[HDAccount.getReceiveAddress(hd, label.index)] = label.label
      })
    })
    
    //let a = []
    //for (let i =0; i <200; i++ ) {
    //  a.push(HDAccount.getReceiveAddress(accounts.get(0), i))
    //}

    const newBtcEntry = {
      'address_labels': addressLabels
    }

    const typeId = derivationMap[BTC]
    const mxpriv = yield select(getMetadataXpriv)
    const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId)
    const newkv = set(KVStoreEntry.value, newBtcEntry, kv)
    yield put(A.createMetadataBtc(newkv))
  }

  const getAddressLabelSize = function * () {
    const wallet = yield select(getWallet)
    const accounts = Wallet.selectHDAccounts(wallet)

    let labelSize = 0
    accounts.map((account) => account.address_labels).map((l) => {
      labelSize += l.size
    })
    
    // return labelSize
    return labelSize + 100
  }

  const fetchMetadataBtc = function * () {
    try {
      const typeId = derivationMap[BTC]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId)
      yield put(A.fetchMetadataBtcLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      //if (isNil(newkv.value)) {
        return yield call(getAddressLabelSize)
      //}
      yield put(A.fetchMetadataBtcSuccess(newkv))
      return false
    } catch (e) {
      yield put(A.fetchMetadataBtcFailure(e.message))
      return false
    }
  }

  return {
    fetchMetadataBtc,
    createMetadataBtc
  }
}
