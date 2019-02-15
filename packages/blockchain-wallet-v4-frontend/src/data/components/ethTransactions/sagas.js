import { put } from 'redux-saga/effects'
import { equals, path } from 'ramda'
import { actions, model } from 'data'

export default () => {
  const { WALLET_TX_SEARCH } = model.form
  const logLocation = 'components/ethTransactions/sagas'
  const initialized = function*() {
    try {
      const initialValues = {
        status: '',
        search: ''
      }
      yield put(actions.form.initialize(WALLET_TX_SEARCH, initialValues))
      yield put(actions.core.data.ethereum.fetchTransactions(null, true))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initialized', e))
    }
  }

  const loadMore = function*() {
    try {
      yield put(actions.core.data.ethereum.fetchTransactions())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'loadMore', e))
    }
  }

  const formChanged = function*(action) {
    try {
      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      if (!equals(WALLET_TX_SEARCH, form)) return
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
    loadMore
  }
}
