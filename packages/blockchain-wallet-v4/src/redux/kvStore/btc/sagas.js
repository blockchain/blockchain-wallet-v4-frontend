import { isEmpty, isNil, pluck, prop, reject } from 'ramda'
import { set } from 'ramda-lens'
import { call, delay, put, select } from 'redux-saga/effects'

import { KVStoreEntry, Wallet } from '../../../types'
import { callTask } from '../../../utils/functional'
import { getWallet } from '../../wallet/selectors'
import { BTC, derivationMap } from '../config'
import { getMetadataXpriv } from '../root/selectors'
import * as A from './actions'

export default ({ api, networks }) => {
  const createMetadataBtc = function * () {
    yield delay(1000)
    const addressLabels = {}

    // TODO: SEGWIT derive correct addresses!
    // const wallet = yield select(getWallet)
    // const accounts = Wallet.selectHDAccounts(wallet)
    // accounts.map(account => {
    //   const hd = accounts.get(account.index)
    //   account.address_labels.map(label => {
    //     addressLabels[HDAccount.getReceiveAddress(hd, label.index)] =
    //       label.label
    //   })
    // })

    const newBtcEntry = {
      address_labels: addressLabels
    }

    const typeId = derivationMap[BTC]
    const mxpriv = yield select(getMetadataXpriv)
    const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId, networks.btc)
    const kvFetched = yield callTask(api.fetchKVStore(kv))
    const newkv = set(KVStoreEntry.value, newBtcEntry, kvFetched)
    yield put(A.createMetadataBtc(newkv))
  }

  const getAddressLabelSize = function * () {
    const wallet = yield select(getWallet)
    const accounts = Wallet.selectHDAccounts(wallet)
    let labelSize = 0

    accounts.map(account => {
      if (prop('address_labels', account)) {
        // v2 => v3 payload
        account.address_labels.map(l => {
          labelSize += l.size
        })
      } else {
        // v3 => v4 payload
        const addressLabels = reject(
          isEmpty,
          pluck('address_labels', account.derivations.toJS())
        )
        labelSize += addressLabels.length
      }
    })

    return labelSize
  }

  const fetchMetadataBtc = function * () {
    try {
      const typeId = derivationMap[BTC]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId, networks.btc)
      yield put(A.fetchMetadataBtcLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      if (isNil(newkv.value) || isEmpty(newkv.value)) {
        return yield call(getAddressLabelSize)
      }
      yield put(A.fetchMetadataBtcSuccess(newkv))
      return -1
    } catch (e) {
      yield put(A.fetchMetadataBtcFailure(e.message))
      return -1
    }
  }

  return {
    fetchMetadataBtc,
    createMetadataBtc
  }
}
