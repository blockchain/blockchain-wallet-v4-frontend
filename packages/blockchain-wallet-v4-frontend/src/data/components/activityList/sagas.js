import { actions, selectors } from 'data'
import { isEmpty } from 'ramda'
import { put, select } from 'redux-saga/effects'
import { Remote } from 'blockchain-wallet-v4/src'

export default () => {
  const initialized = function * () {
    try {
      const logsR = yield select(selectors.core.data.misc.getLogs)
      const btcTransactions = yield select(
        selectors.core.data.btc.getTransactions
      )
      const bchTransactions = yield select(
        selectors.core.data.bch.getTransactions
      )
      const ethTransactions = yield select(
        selectors.core.data.eth.getTransactions
      )
      const xlmTransactions = yield select(
        selectors.core.data.xlm.getTransactions
      )
      if (!Remote.Success.is(logsR)) {
        yield put(actions.core.data.misc.fetchLogs())
      }
      if (isEmpty(btcTransactions)) {
        yield put(actions.core.data.btc.fetchTransactions('', true))
      }
      if (isEmpty(bchTransactions)) {
        yield put(actions.core.data.bch.fetchTransactions('', true))
      }
      if (isEmpty(ethTransactions)) {
        yield put(actions.core.data.eth.fetchTransactions())
      }
      if (isEmpty(xlmTransactions)) {
        yield put(actions.core.data.xlm.fetchTransactions())
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          'components/activityList/sagas',
          'initialized',
          e
        )
      )
    }
  }

  return {
    initialized
  }
}
