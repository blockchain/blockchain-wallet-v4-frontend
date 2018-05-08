import { select, put } from 'redux-saga/effects'
import { equals, path, prop } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import { actions, selectors } from 'data'

export default ({ coreSagas }) => {
  const logLocation = 'components/bchTransactions/sagas'
  const initialized = function * () {
    try {
      const defaultSource = ''
      const initialValues = {
        source: defaultSource,
        status: '',
        search: ''
      }
      yield put(actions.form.initialize('bchTransactions', initialValues))
      const bchTransactionsR = yield select(selectors.core.data.bch.getTransactions)
      if (!Remote.Success.is(bchTransactionsR)) yield put(actions.core.data.bch.fetchTransactions(defaultSource))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initialized', e))
    }
  }

  const scrollUpdated = function * (action) {
    try {
      const pathname = yield select(selectors.router.getPathname)
      if (!equals(pathname, '/bch/transactions')) return
      const formValues = yield select(selectors.form.getFormValues('bchTransactions'))
      const source = prop('source', formValues)
      const threshold = 250
      const { yMax, yOffset } = action.payload
      if (yMax - yOffset < threshold) {
        yield put(actions.core.data.bch.fetchTransactions(source, false))
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'scrollUpdated', e))
    }
  }

  const formChanged = function * (action) {
    try {
      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      const payload = prop('payload', action)
      if (!equals('bchTransactions', form)) return

      switch (field) {
        case 'source':
          const source = payload.xpub || payload.address
          yield put(actions.core.data.bch.fetchTransactions(source, true))
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
