import { select, put } from 'redux-saga/effects'
import { equals, path, prop } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import { actions, selectors } from 'data'

export default ({ coreSagas }) => {
  const initialized = function * () {
    try {
      const defaultSource = ''
      const initialValues = {
        source: defaultSource,
        status: '',
        search: ''
      }
      yield put(actions.form.initialize('btcTransactions', initialValues))
      const btcTransactionsR = yield select(selectors.core.data.bitcoin.getTransactions)
      if (!Remote.Success.is(btcTransactionsR)) yield put(actions.core.data.bitcoin.fetchTransactions(defaultSource))
    } catch (e) {
      console.log(e)
    }
  }

  const scrollUpdated = function * (action) {
    try {
      const formValues = yield select(selectors.form.getFormValues('btcTransactions'))
      const source = prop('source', formValues)
      const threshold = 250
      const { yMax, yOffset } = action.payload
      console.log(yMax, yOffset, threshold, yMax - yOffset < threshold)
      if (yMax - yOffset < threshold) {
        yield put(actions.core.data.bitcoin.fetchTransactions(source, false))
      }
    } catch (e) {
      console.log(e)
    }
  }

  const formChanged = function * (action) {
    try {
      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      const payload = prop('payload', action)
      if (!equals('btcTransactions', form)) return
      yield console.log(form, field, payload)
      switch (field) {
        case 'source':
          console.log('source changed:' + payload)
          const source = payload.xpub || payload.address
          yield put(actions.core.data.bitcoin.fetchTransactions(source, true))
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
