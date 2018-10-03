import { select, put } from 'redux-saga/effects'
import { prop } from 'ramda'
import moment from 'services/MomentHelper'
import * as actions from '../../actions'
import * as selectors from '../../selectors'

export const initialValues = {
  from: '',
  start: moment()
    .startOf('day')
    .subtract(7, 'day'),
  end: moment().startOf('day')
}
export const logLocation = 'components/transactionReport/sagas'

export default ({ coreSagas }) => {
  const initialized = function*() {
    try {
      const language = yield select(selectors.preferences.getLanguage)
      moment.locale(language)

      yield put(actions.form.initialize('transactionReport', initialValues))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initialized', e))
    }
  }

  const destroyed = function*() {
    yield put(actions.core.data.bitcoin.clearTransactionHistory())
    yield put(actions.core.data.bch.clearTransactionHistory())
  }

  const submitClicked = function*(action) {
    try {
      const { coin } = action.payload
      const formValues = yield select(
        selectors.form.getFormValues('transactionReport')
      )
      const from = prop('from', formValues)
      const start = prop('start', formValues)
      const end = prop('end', formValues)
      const address = from && (from.xpub || from.address)
      const startDate = moment(start).format('DD/MM/YYYY')
      const endDate = moment(end).format('DD/MM/YYYY')
      switch (coin) {
        case 'BCH':
          return yield put(
            actions.core.data.bch.fetchTransactionHistory(
              address,
              startDate,
              endDate
            )
          )
        case 'BTC':
          return yield put(
            actions.core.data.bitcoin.fetchTransactionHistory(
              address,
              startDate,
              endDate
            )
          )
        default:
          return yield put(
            actions.core.data.bitcoin.fetchTransactionHistory(
              address,
              startDate,
              endDate
            )
          )
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'submitClicked', e))
    }
  }

  return {
    initialized,
    destroyed,
    submitClicked
  }
}
