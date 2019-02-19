import { all, call, put, select } from 'redux-saga/effects'
import {
  concat,
  compose,
  filter,
  last,
  length,
  map,
  path,
  prop,
  reduce,
  values,
  unnest
} from 'ramda'
import BigNumber from 'bignumber.js'

import * as A from './actions'
import * as S from './selectors'
import * as selectors from '../../selectors'
import Remote from '../../../remote'
import { xlm } from '../../../transactions'
import { getAccounts } from '../../kvStore/xlm/selectors'
import { getLockboxXlmAccounts } from '../../kvStore/lockbox/selectors'

const { transformTx, decodeOperations, isLumenOperation } = xlm

export const ACCOUNT_NOT_FOUND = 'Not Found'
export const TX_PER_PAGE = 10

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
      yield put(A.setLedgerDetailsLoading)
      const ledger = yield call(api.getLatestLedgerDetails)
      yield put(A.setLedgerDetailsSuccess(ledger))
    } catch (e) {
      yield put(A.setLedgerDetailsFailure(e))
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
      yield put(A.setRatesLoading())
      const data = yield call(api.getXlmTicker)
      yield put(A.setRatesSuccess(data))
    } catch (e) {
      yield put(A.setRatesFailure(e))
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
        .map(prop('pagingToken'))
        .getOrElse(null)
      const offset = reset ? null : length(pages) * TX_PER_PAGE
      const transactionsAtBound = yield select(S.getTransactionsAtBound)
      if (Remote.Loading.is(last(pages))) return
      if (transactionsAtBound && !reset) return
      yield put(A.fetchTransactionsLoading(reset))
      const txs = yield call(api.getXlmTransactions, {
        publicKey,
        limit: TX_PER_PAGE,
        cursor: offset,
        pagingToken,
        reset
      })
      const atBounds = length(txs) < TX_PER_PAGE
      yield put(A.transactionsAtBound(atBounds))
      const page = yield call(__processTxs, txs)
      yield put(A.fetchTransactionsSuccess(page, reset))
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

  const __processTxs = function*(txList) {
    const walletAccountsR = yield select(getAccounts)
    const walletAccounts = walletAccountsR.getOrElse([])
    const lockboxAccountsR = yield select(getLockboxXlmAccounts)
    const lockboxAccounts = lockboxAccountsR.getOrElse([])
    const accounts = concat(walletAccounts, lockboxAccounts)
    return unnest(
      map(tx => {
        const operations = decodeOperations(tx)
        return compose(
          filter(prop('belongsToWallet')),
          map(transformTx(accounts, tx)),
          filter(isLumenOperation)
        )(operations)
      }, txList)
    )
  }

  return {
    createAccounts,
    fetchLedgerDetails,
    fetchData,
    fetchRates,
    __processTxs,
    fetchTransactions
  }
}
