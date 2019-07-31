import { call, put, select } from 'redux-saga/effects'
import { actions, selectors } from 'data'
import * as A from './actions.js'

export default ({ api }) => {
  const logLocation = 'components/send/sagas'

  const fetchPaymentsAccountPit = function * (action) {
    const { currency } = action.payload
    try {
      const isPitAccountLinked = (yield select(
        selectors.modules.profile.isPitAccountLinked
      )).getOrElse(false)
      if (!isPitAccountLinked) throw new Error('Wallet is not linked to PIT')
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
