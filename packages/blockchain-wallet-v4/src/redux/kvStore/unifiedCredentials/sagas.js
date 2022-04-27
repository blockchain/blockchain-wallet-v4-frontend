import { isEmpty, isNil } from 'ramda'
import { set } from 'ramda-lens'
import { call, put, select } from 'redux-saga/effects'

import { KVStoreEntry } from '../../../types'
import { callTask } from '../../../utils/functional'
import { getCreateExchangeUserOnSignupOrLogin } from '../../walletOptions/selectors'
import { derivationMap, UNIFIED_CREDENTIALS } from '../config'
import { getMetadataXpriv } from '../root/selectors'
import * as A from './actions'

export default ({ api, networks }) => {
  const createUnifiedCredentials = function* (kv) {
    const newKv = set(
      KVStoreEntry.value,
      {
        exchange_lifetime_token: '',
        exchange_user_id: '',
        nabu_lifetime_token: '',
        nabu_user_id: ''
      },
      kv
    )
    yield put(A.createMetadataUnifiedCredentials(newKv))
  }

  const fetchMetadataUnifiedCredentials = function* () {
    try {
      yield put(A.fetchMetadataUnifiedCredentialsLoading())
      const isCreateUnifiedCredentialsEnabled = (yield select(
        getCreateExchangeUserOnSignupOrLogin
      )).getOrElse(false)
      const metadataXPriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(
        metadataXPriv,
        derivationMap[UNIFIED_CREDENTIALS],
        networks.btc
      )
      const newKv = yield callTask(api.fetchKVStore(kv))
      if (isCreateUnifiedCredentialsEnabled && (isNil(newKv.value) || isEmpty(newKv.value))) {
        yield call(createUnifiedCredentials, newKv)
      } else {
        yield put(A.fetchMetadataUnifiedCredentialsSuccess(newKv))
      }
    } catch (e) {
      yield put(A.fetchMetadataUnifiedCredentialsFailure(e.message))
    }
  }

  return {
    fetchMetadataUnifiedCredentials
  }
}
