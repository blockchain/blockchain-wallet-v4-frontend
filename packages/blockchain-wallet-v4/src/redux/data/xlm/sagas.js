import { all, call, put, select } from 'redux-saga/effects'
import { compose, last, length, map, path, prop, reduce, values } from 'ramda'
import BigNumber from 'bignumber.js'

import * as A from './actions'
import * as S from './selectors'
import * as selectors from '../../selectors'
import Remote from '../../../remote'

export const NO_ACCOUNT_ID_ERROR = 'No account id'
export const ACCOUNT_NOT_FOUND = 'Not Found'
export const TX_PER_PAGE = 10
export const OPERATIONS_PER_TX = 1

export const sumBigNumbers = reduce(
  (num1, num2) => new BigNumber.sum(num1, num2).toString(),
  '0'
)

const sumBalance = compose(
  sumBigNumbers,
  map(account => account.map(S.selectBalanceFromAccount).getOrElse('0')),
  values
)

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
    } catch (e) {}
  }

  const fetchAccount = function*(id) {
    try {
      yield put(A.fetchAccountLoading(id))
      const account = yield call(api.getXlmAccount, id)
      yield put(A.fetchAccountSuccess(id, account))
    } catch (e) {
      yield put(A.fetchAccountFailure(id, e))
    }
  }

  const fetchData = function*() {
    const accountIds = yield select(S.getContext)
    yield all(accountIds.map(id => call(fetchAccount, id)))
    const accounts = yield select(S.getAccounts)
    const data = { info: { final_balance: sumBalance(accounts) } }
    yield put(A.fetchDataSuccess(data))
  }

  const fetchRates = function*() {
    try {
      yield put(A.setRates(Remote.Loading))
      const data = yield call(api.getXlmTicker)
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
      if (statusCode === 404) {
        yield put(A.fetchTransactionsSuccess([]))
        yield put(A.transactionsAtBound(true))
        return
      }
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
