import { select, put } from 'redux-saga/effects'
import { isEmpty } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import { actions, selectors } from 'data'

export default ({ coreSagas }) => {
  const initialized = function * () {
    try {
      const logsR = yield select(selectors.core.data.misc.getLogs)
      const btcTransactions = yield select(selectors.core.data.bitcoin.getTransactions)
      const bchTransactions = yield select(selectors.core.data.bch.getTransactions)
      const ethTransactions = yield select(selectors.core.data.ethereum.getTransactions)
      if (!Remote.Success.is(logsR)) yield put(actions.core.data.misc.fetchLogs())
      if (isEmpty(btcTransactions)) yield put(actions.core.data.bitcoin.fetchTransactions('', true))
      if (isEmpty(bchTransactions)) yield put(actions.core.data.bch.fetchTransactions('', true))
      if (isEmpty(ethTransactions)) yield put(actions.core.data.ethereum.fetchTransactions())
    } catch (e) {
      yield put(actions.logs.logErrorMessage('components/activityList/sagas', 'initialized', e))
    }
  }

  return {
    initialized
  }
}
