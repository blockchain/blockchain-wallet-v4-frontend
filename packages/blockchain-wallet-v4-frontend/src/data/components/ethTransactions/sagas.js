import { select, put } from 'redux-saga/effects'
import { equals, path } from 'ramda'
import { actions, selectors } from 'data'

export default ({ coreSagas }) => {
  const logLocation = 'components/ethTransactions/sagas'
  const initialized = function*() {
    try {
      const initialValues = {
        status: '',
        search: ''
      }
      yield put(actions.form.initialize('ethTransactions', initialValues))
      yield put(actions.core.data.ethereum.fetchTransactions(true))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initialized', e))
    }
  }

  const scrollUpdated = function*(action) {
    try {
      const pathname = yield select(selectors.router.getPathname)
      if (!equals(pathname, '/eth/transactions')) return
      const threshold = 250
      const { yMax, yOffset } = action.payload

      if (yMax - yOffset < threshold) {
        yield put(actions.core.data.ethereum.fetchTransactions())
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'scrollUpdated', e))
    }
  }

  const formChanged = function*(action) {
    try {
      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      if (!equals('ethTransactions', form)) return
      switch (field) {
        case 'source':
          yield put(actions.core.data.ethereum.fetchTransactions())
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
