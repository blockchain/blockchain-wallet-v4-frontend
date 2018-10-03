import { select, put } from 'redux-saga/effects'
import { equals, path, prop } from 'ramda'
import { actions, selectors } from 'data'

export const logLocation = 'components/btcTransactions/sagas'

export default ({ coreSagas }) => {
  const initialized = function*() {
    try {
      const defaultSource = ''
      const initialValues = {
        source: defaultSource,
        status: '',
        search: ''
      }
      yield put(actions.form.initialize('btcTransactions', initialValues))
      yield put(
        actions.core.data.bitcoin.fetchTransactions(defaultSource, true)
      )
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initialized', e))
    }
  }

  const reportClicked = function*() {
    try {
      yield put(actions.modals.showModal('TransactionReport', { coin: 'BTC' }))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'reportClicked', e))
    }
  }

  const scrollUpdated = function*(action) {
    try {
      const pathname = yield select(selectors.router.getPathname)
      if (!equals(pathname, '/btc/transactions')) return
      const formValues = yield select(
        selectors.form.getFormValues('btcTransactions')
      )
      const source = prop('source', formValues)
      const threshold = 250
      const { yMax, yOffset } = action.payload
      if (yMax - yOffset < threshold) {
        const onlyShow = equals(source, 'all')
          ? ''
          : source.xpub || source.address
        yield put(actions.core.data.bitcoin.fetchTransactions(onlyShow, false))
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'scrollUpdated', e))
    }
  }

  const formChanged = function*(action) {
    try {
      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      const payload = prop('payload', action)
      if (!equals('btcTransactions', form)) return

      switch (field) {
        case 'source':
          const onlyShow = equals(payload, 'all')
            ? ''
            : payload.xpub || payload.address
          yield put(actions.core.data.bitcoin.fetchTransactions(onlyShow, true))
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'formChanged', e))
    }
  }

  return {
    initialized,
    reportClicked,
    formChanged,
    scrollUpdated
  }
}
