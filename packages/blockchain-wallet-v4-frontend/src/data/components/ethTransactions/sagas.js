import { select, put } from 'redux-saga/effects'
import { equals, path } from 'ramda'
import { actions, selectors } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'

export default ({ coreSagas }) => {
  const logLocation = 'components/ethTransactions/sagas'
  const initialized = function * () {
    try {
      const initialValues = {
        status: '',
        search: ''
      }
      yield put(actions.form.initialize('ethTransactions', initialValues))
      const ethTransactionsR = yield select(selectors.core.data.ethereum.getTransactions)
      if (!Remote.Success.is(ethTransactionsR)) yield put(actions.core.data.ethereum.fetchData(true))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initialized', e))
    }
  }

  const scrollUpdated = function * (action) {
    try {
      const pathname = yield select(selectors.router.getPathname)
      if (!equals(pathname, '/eth/transactions')) return
      const threshold = 250
      const { yMax, yOffset } = action.payload

      if (yMax - yOffset < threshold) {
        yield put(actions.core.data.ethereum.fetchData())
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'scrollUpdated', e))
    }
  }

  const formChanged = function * (action) {
    try {
      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      if (!equals('ethTransactions', form)) return
      switch (field) {
        case 'source':
          yield put(actions.core.data.ethereum.fetchData())
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'formChanged', e))
    }
  }

  return {
    initialized,
    formChanged,
    scrollUpdated
  }
}
