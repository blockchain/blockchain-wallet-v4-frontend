import { select, put } from 'redux-saga/effects'
import { equals, path, prop } from 'ramda'
import { actions, selectors, model } from 'data'
export const logLocation = 'components/bchTransactions/sagas'

export default () => {
  const { WALLET_TX_SEARCH } = model.form

  const initialized = function*() {
    try {
      const defaultSource = 'all'
      const initialValues = {
        source: defaultSource,
        status: '',
        search: ''
      }
      yield put(actions.form.initialize(WALLET_TX_SEARCH, initialValues))
      yield put(actions.core.data.bch.fetchTransactions('', true))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initialized', e))
    }
  }

  const reportClicked = function*() {
    try {
      yield put(actions.modals.showModal('TransactionReport', { coin: 'BCH' }))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'reportClicked', e))
    }
  }

  const loadMore = function*() {
    try {
      const formValues = yield select(
        selectors.form.getFormValues(WALLET_TX_SEARCH)
      )
      const source = prop('source', formValues)
      const onlyShow = equals(source, 'all')
        ? ''
        : source.xpub || source.address
      yield put(actions.core.data.bch.fetchTransactions(onlyShow, false))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'loadMore', e))
    }
  }

  const formChanged = function*(action) {
    try {
      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      const payload = prop('payload', action)
      if (!equals(WALLET_TX_SEARCH, form)) return

      switch (field) {
        case 'source':
          const onlyShow = equals(payload, 'all')
            ? ''
            : payload.xpub || payload.address
          yield put(actions.core.data.bch.fetchTransactions(onlyShow, true))
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'formChanged', e))
    }
  }

  return {
    initialized,
    reportClicked,
    formChanged,
    loadMore
  }
}
