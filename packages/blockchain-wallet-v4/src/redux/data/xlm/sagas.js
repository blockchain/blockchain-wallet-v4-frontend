import { all, call, put, select } from 'redux-saga/effects'
import { indexBy, last, length, path, prop } from 'ramda'

import * as A from './actions'
import * as S from './selectors'
import * as selectors from '../../selectors'
import Remote from '../../../remote'

export const NO_ACCOUNT_ID_ERROR = 'No account id'
export const ACCOUNT_NOT_FOUND = 'Not Found'
export const TX_PER_PAGE = 10
export const OPERATIONS_PER_TX = 1

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
      yield put(A.fetchDataFailure(e))
    }
  }

  const fetchData = function*() {
    try {
      yield put(A.fetchDataLoading())
      const accountIds = yield select(S.getContext)
      const accounts = yield all(
        accountIds.map(id => call(api.getXlmAccount, id))
      )
      yield put(A.fetchDataSuccess(indexBy(prop('account_id'), accounts)))
    } catch (e) {
      const message = prop('message', e)
      if (message === ACCOUNT_NOT_FOUND) {
        return yield call(createAccounts)
      }
      yield put(A.fetchDataFailure(e))
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

  const fetchTransactions = function*(action) {
    try {
      const { payload } = action
      const { accountId, reset } = payload
      const defaultAccountR = yield select(
        selectors.kvStore.xlm.getDefaultAccountId
      )
      const publicKey =
        accountId || defaultAccountR.getOrFail(ACCOUNT_NOT_FOUND)
      const pages = yield select(S.getTransactions)
      const pagingToken = (last(pages) || Remote.NotAsked)
        .map(last)
        .map(prop('paging_token'))
        .getOrElse(null)
      const transactionsAtBound = yield select(S.getTransactionsAtBound)
      if (transactionsAtBound && !reset) return
      yield put(A.fetchTransactionsLoading(reset))
      const txs = yield call(api.getXlmTransactions, {
        publicKey,
        limit: TX_PER_PAGE,
        pagingToken,
        reset
      })
      const atBounds = length(txs) < TX_PER_PAGE
      yield put(A.transactionsAtBound(atBounds))
      yield put(A.fetchTransactionsSuccess(txs, reset))
    } catch (e) {
      const statusCode = path(['response', 'status'], e)
      if (statusCode === 404) return yield put(A.fetchTransactionsSuccess([]))
      yield put(A.fetchTransactionsFailure(e.message))
    }
  }

  return {
    createAccounts,
    fetchLedgerDetails,
    fetchData,
    fetchRates,
    fetchTransactions
  }
}
