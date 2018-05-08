import { select, put } from 'redux-saga/effects'
import { Remote } from 'blockchain-wallet-v4/src'
import { actions, selectors } from 'data'

export default ({ coreSagas }) => {
  const initialized = function * () {
    try {
      const logsR = yield select(selectors.core.data.misc.getLogs)
      const btcTransactionsR = yield select(selectors.core.data.bitcoin.getTransactions, '')
      const bchTransactionsR = yield select(selectors.core.data.bch.getTransactions)
      const ethTransactionsR = yield select(selectors.core.data.ethereum.getTransactions)
      const ethContext = yield select(selectors.core.kvStore.ethereum.getContext)
      if (!Remote.Success.is(logsR)) yield put(actions.core.data.misc.fetchLogs())
      if (!Remote.Success.is(btcTransactionsR)) yield put(actions.core.data.bitcoin.fetchTransactions('', true))
      if (!Remote.Success.is(bchTransactionsR)) yield put(actions.core.data.bch.fetchTransactions('', true))
      if (!Remote.Success.is(ethTransactionsR)) yield put(actions.core.data.ethereum.fetchTransactions(ethContext.getOrFail('Could not find Ethereum context.')))
    } catch (e) {
      yield put(actions.logs.logErrorMessage('components/activityList/sagas', 'initialized', e))
    }
  }

  return {
    initialized
  }
}
