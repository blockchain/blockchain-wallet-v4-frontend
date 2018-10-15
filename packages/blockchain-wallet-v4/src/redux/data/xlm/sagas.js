import { all, call, put, select } from 'redux-saga/effects'
import { indexBy, prop } from 'ramda'

import * as A from './actions'
import * as S from './selectors'
import Remote from '../../../remote'

export const NO_ACCOUNT_ID_ERROR = 'No account id'
export const ACCOUNT_NOT_FOUND = 'Not Found'

export default ({ api, networks }) => {
  const fetchLedgerDetails = function*() {
    try {
      yield put(A.setLedgerDetails(Remote.Loading))
      const ledger = yield call(api.getLatestLedgerDetails)
      yield put(A.setLedgerDetails(Remote.Success(ledger)))
    } catch (e) {
      yield put(A.setLedgerDetails(Remote.Failure(e)))
    }
  }

  const createAccounts = function*() {
    if (networks.xlm !== 'testnet') return
    try {
      const accountIds = yield select(S.getContext)
      yield all(accountIds.map(id => call(api.createXlmAccount, id)))
      yield call(fetchData)
    } catch (e) {
      yield put(A.setData(Remote.Failure(e)))
    }
  }

  const fetchData = function*() {
    try {
      yield put(A.setData(Remote.Loading))
      const accountIds = yield select(S.getContext)
      const accounts = yield all(
        accountIds.map(id => call(api.getXlmAccount, id))
      )
      yield put(
        A.setData(Remote.Success(indexBy(prop('account_id'), accounts)))
      )
    } catch (e) {
      const message = prop('message', e)
      if (message === ACCOUNT_NOT_FOUND) {
        return yield call(createAccounts)
      }
      yield put(A.setData(Remote.Failure(e)))
    }
  }

  const fetchRates = function*() {
    try {
      yield put(A.setRates(Remote.Loading))
      // TODO: XLM: replace with getXlmTicker
      const data = yield call(api.getBitcoinTicker)
      yield put(A.setRates(Remote.Success(data)))
    } catch (e) {
      yield put(A.setRates(Remote.Failure(e)))
    }
  }

  return {
    createAccounts,
    fetchLedgerDetails,
    fetchData,
    fetchRates
  }
}
