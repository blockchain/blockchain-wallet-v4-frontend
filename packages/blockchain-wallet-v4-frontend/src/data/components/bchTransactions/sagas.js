import { put } from 'redux-saga/effects'
import { equals, path, prop } from 'ramda'
import { actions } from 'data'

export default () => {
  const logLocation = 'components/bchTransactions/sagas'

  const initialized = function*() {
    try {
      const defaultSource = 'all'
      const initialValues = {
        source: defaultSource,
        status: '',
        search: ''
      }
      yield put(actions.form.initialize('transactions', initialValues))
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

  const formChanged = function*(action) {
    try {
      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      const payload = prop('payload', action)
      if (!equals('transactions', form)) return

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
    formChanged
  }
}
