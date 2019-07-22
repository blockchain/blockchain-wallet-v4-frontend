import { put, call } from 'redux-saga/effects'
import { actions } from 'data'
import * as A from './actions.js'

export default ({ api }) => {
  const logLocation = 'components/send/sagas'

  const fetchPaymentsAccountPit = function * (action) {
    const { currency } = action.payload
    try {
      yield put(A.fetchPaymentsAccountPitLoading(currency))
      const data = yield call(api.getPaymentsAccountPit, currency)
      yield put(A.fetchPaymentsAccountPitSuccess(currency, data))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'fetchPaymentsAccountPit', e)
      )
      yield put(A.fetchPaymentsAccountPitFailure(currency, e))
    }
  }

  return {
    fetchPaymentsAccountPit
  }
}
