import * as A from './actions.js'
import { actions, actionTypes, model, selectors } from 'data'
import { call, put, select, take } from 'redux-saga/effects'
import { Remote } from 'blockchain-wallet-v4/src'

const { BAD_2FA } = model.profile.ERROR_TYPES

export default ({ api }) => {
  const logLocation = 'components/send/sagas'

  const waitForUserData = function * () {
    const userData = yield select(selectors.modules.profile.getUserData)
    if (Remote.Success.is(userData)) return
    yield take(actionTypes.modules.profile.FETCH_USER_DATA_SUCCESS)
  }

  const fetchPaymentsAccountPit = function * (action) {
    const { currency } = action.payload
    try {
      yield call(waitForUserData)
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
      if (e.type === BAD_2FA) {
        yield put(
          A.fetchPaymentsAccountPitSuccess(currency, { address: e.type })
        )
      } else {
        yield put(A.fetchPaymentsAccountPitFailure(currency, e))
      }
    }
  }

  return {
    fetchPaymentsAccountPit
  }
}
