import {
  concat,
  forEach,
  gt,
  isEmpty,
  isNil,
  last,
  length,
  map,
  pathOr,
  propOr,
  range,
  splitAt,
  startsWith
} from 'ramda'
import { set } from 'ramda-lens'
import { call, put, select } from 'redux-saga/effects'

import { Address, KVStoreEntry } from '../../../types'
import { callTask } from '../../../utils/functional'
import * as bchActions from '../../data/bch/actions'
import { getHDAccounts } from '../../wallet/selectors'
import { BCH, derivationMap } from '../config'
import { getMetadataXpriv } from '../root/selectors'
import * as A from './actions'

const BCH_ACCT_NAME = 'Private Key Wallet'

export default ({ api, networks }) => {
  const createBch = function * (kv, hdAccounts, bchAccounts) {
    const createAccountEntry = x => ({
      label: `${BCH_ACCT_NAME}${x > 0 ? ` ${x + 1}` : ''}`,
      archived: pathOr(false, [x, 'archived'], hdAccounts)
    })

    const newBchEntry = {
      default_account_idx: 0,
      accounts: concat(
        bchAccounts,
        map(createAccountEntry, range(length(bchAccounts), hdAccounts.length))
      ),
      addresses: {}
    }

    const newkv = set(KVStoreEntry.value, newBchEntry, kv)
    yield put(A.createMetadataBch(newkv))
    yield put(bchActions.fetchData())
  }

  const createBchAddresses = function * (kv) {
    const newBchEntry = {
      ...kv.value,
      addresses: {}
    }
    const newkv = set(KVStoreEntry.value, newBchEntry, kv)
    yield put(A.createMetadataBch(newkv))
  }

  const importLegacyAddress = function * (action) {
    const { payload } = action
    const { key, label } = payload
    const addr = Address.importAddress(
      key,
      new Date(),
      label,
      networks.bch
    ).toJS()
    yield put(A.setLegacyAddress(addr))
  }

  const fetchMetadataBch = function * () {
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
      } else if (isNil(newkv.value.addresses)) {
        return yield call(createBchAddresses, newkv)
      }
      // update account labels
      const legacyWalletName = 'My Bitcoin Cash Wallet'
      forEach(account => {
        // check if legacy format is used
        if (startsWith(legacyWalletName, account.label)) {
          // pluck label suffix e.g. " 2"
          const labelSuffix = last(splitAt(22, account.label))
          account.label = `${BCH_ACCT_NAME}${labelSuffix}`
        }
      }, newkv.value.accounts)
      yield put(A.fetchMetadataBchSuccess(newkv))
    } catch (e) {
      yield put(A.fetchMetadataBchFailure(e.message))
    }
  }

  return {
    createBch,
    fetchMetadataBch,
    importLegacyAddress
  }
}
