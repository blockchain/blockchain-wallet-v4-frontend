import { call, put, select } from 'redux-saga/effects'
import * as T from 'services/AlertService'
import {
  append,
  contains,
  compose,
  intersection,
  isEmpty,
  map,
  path,
  test
} from 'ramda'

import { actions, selectors } from 'data'
import { transactions } from 'blockchain-wallet-v4/src'

const { decodeOperations, getDestination } = transactions.xlm

export default () => {
  const getAccountIds = tx =>
    compose(
      append(tx.source_account),
      map(getDestination),
      decodeOperations
    )(tx)

  const addWalletTransaction = function*(tx) {
    const defaultAccountId = (yield select(
      selectors.core.kvStore.xlm.getDefaultAccountId
    )).getOrElse('')
    const txAccountIds = getAccountIds(tx)
    if (contains(defaultAccountId, txAccountIds))
      yield put(actions.core.data.xlm.addNewTransactions([tx]))
  }

  const addLockboxTransaction = function*(tx, deviceIndex) {
    const deviceAccountIds = (yield select(
      selectors.core.kvStore.lockbox.getXlmContextForDevice,
      deviceIndex
    )).getOrElse([])
    const txAccountIds = getAccountIds(tx)
    if (!isEmpty(intersection(txAccountIds, deviceAccountIds)))
      yield put(actions.core.data.xlm.addNewTransactions([tx]))
  }

  const onMessage = function*({ payload }) {
    try {
      const { accountId, tx } = payload
      if (tx.source_account !== accountId) {
        yield put(actions.alerts.displaySuccess(T.PAYMENT_RECEIVED_XLM))
      }
      yield put(actions.core.data.xlm.fetchData())
      const pathname = yield select(selectors.router.getPathname)
      if (contains(pathname, ['/xlm/transactions', '/home']))
        yield call(addWalletTransaction, tx)
      if (test(/\/lockbox\/dashboard\//, pathname))
        yield call(
          addLockboxTransaction,
          tx,
          pathname.replace(/\/lockbox\/dashboard\/(.*)/, ($0, $1) => $1)
        )
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          'middleware/webSocket/xlm/sagas',
          'onOpen',
          e.message
        )
      )
    }
  }

  const onError = action => {
    const message = path(['payload', 'error', 'message'], action)
    actions.logs.logErrorMessage(
      'middleware/webSocket/xlm/sagas',
      'streamError',
      message
    )
  }

  return {
    onMessage,
    onError
  }
}
