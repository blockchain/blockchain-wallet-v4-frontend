import { select, put } from 'redux-saga/effects'
import { equals, path, prop } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import { actions, selectors } from 'data'

export default ({ coreSagas }) => {
  const initialized = function * () {
    try {
      const initialValues = {
        status: '',
        search: ''
      }
      yield put(actions.form.initialize('ethTransactions', initialValues))
      const ethTransactionsR = yield select(selectors.core.data.eth.getTransactions)
      if (!Remote.Success.is(ethTransactionsR)) yield put(actions.core.data.eth.fetchTransactions())
    } catch (e) {
      console.log(e)
    }
  }

  const scrollUpdated = function * (action) {
    try {
      const threshold = 250
      const { yMax, yOffset } = action.payload
      if (yMax - yOffset < threshold) {
        yield put(actions.core.data.eth.fetchTransactions(false))
      }
    } catch (e) {
      console.log(e)
    }
  }

  const formChanged = function * (action) {
    try {
      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      if (!equals('ethTransactions', form)) return
      switch (field) {
        case 'source':
          yield put(actions.core.data.eth.fetchTransactions())
      }
    } catch (e) {
      console.log(e)
    }
  }

  return {
    initialized,
    formChanged,
    scrollUpdated
  }
}
