import { call, put, select } from 'redux-saga/effects'
import { prop } from 'ramda'

import * as A from './actions'
import * as selectors from '../../selectors'
import Remote from '../../../remote'

export const NO_ACCOUNT_ID_ERROR = 'No account id'
export const ACCOUNT_NOT_FOUND = 'Not Found'

export default ({ api }) => {
  const fetchLedgerDetails = function*() {
    try {
      yield put(A.setLedgerDetails(Remote.Loading))
      const ledger = yield call(api.getLatestLedgerDetails)
      yield put(A.setLedgerDetails(Remote.Success(ledger)))
    } catch (e) {
      yield put(A.setLedgerDetails(Remote.Failure(e)))
    }
  }

  const createAccount = function*() {
    try {
      const accountId = (yield select(
        selectors.kvStore.xlm.getDefaultAccountId
      )).getOrFail('No account id')
      yield call(api.createXlmAccount, accountId)
      yield call(fetchAccount)
    } catch (e) {
      yield put(A.setAccount(Remote.Failure(e)))
    }
  }

  const fetchAccount = function*() {
    try {
      yield put(A.setAccount(Remote.Loading))
      const accountId = (yield select(
        selectors.kvStore.xlm.getDefaultAccountId
      )).getOrFail('No account id')
      const account = yield call(api.getXlmAccount, accountId)
      yield put(A.setAccount(Remote.Success(account)))
    } catch (e) {
      const message = prop('message', e)
      if (message === ACCOUNT_NOT_FOUND) {
        return yield call(createAccount)
      }
      yield put(A.setAccount(Remote.Failure(e)))
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
    createAccount,
    fetchLedgerDetails,
    fetchAccount,
    fetchRates
  }
}
