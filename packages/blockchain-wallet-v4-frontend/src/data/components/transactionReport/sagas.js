import { select, put } from 'redux-saga/effects'
import { equals, path, prop } from 'ramda'
import moment from 'moment'
import * as actions from '../../actions'
import * as selectors from '../../selectors'

export default ({ coreSagas }) => {
  const logLocation = 'components/transactionReport/sagas'

  const initialized = function * (action) {
    try {
      const language = yield select(selectors.preferences.getLanguage)
      moment.locale(language)
      const initialValues = {
        from: '',
        start: moment().subtract(7, 'day'),
        end: moment()
      }
      yield put(actions.form.initialize('transactionReport', initialValues))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initialized', e))
    }
  }

  const destroyed = function * () {
    yield put(actions.form.destroy('transactionReport'))
  }

  const submitClicked = function * (action) {
    try {
      const { coin } = action.payload
      console.log('coin', coin)
      const language = yield select(selectors.preferences.getLanguage)
      moment.locale(language)
      console.log('language', language)
      const formValues = yield select(selectors.form.getFormValues('transactionReport'))
      const from = prop('from', formValues)
      const start = prop('start', formValues)
      const end = prop('end', formValues)
      console.log('formValues', formValues)
      const address = from && (from.xpub || from.address)
      const startDate = moment(start).format('DD/MM/YYYY')
      const endDate = moment(end).format('DD/MM/YYYY')
      console.log('submitClicked', address, startDate, endDate)
      switch (coin) {
        case 'BCH': return yield put(actions.core.data.bch.transactionHistory.fetchTransactionHistory(address, startDate, endDate))
        case 'BTC': return yield put(actions.core.data.bitcoin.transactionHistory.fetchTransactionHistory(address, startDate, endDate))
        default: return yield put(actions.core.data.bitcoin.transactionHistory.fetchTransactionHistory(address, startDate, endDate))
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'submitClicked', e))
    }
  }

  const formChanged = function * (action) {
    try {
      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      // const payload = prop('payload', action)
      if (!equals('transactionReport', form)) return

      switch (field) {
        case 'from':
          break
        case 'start':
          break
        case 'end':
          break
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'formChanged', e))
    }
  }

  return {
    initialized,
    destroyed,
    submitClicked,
    formChanged
  }
}
