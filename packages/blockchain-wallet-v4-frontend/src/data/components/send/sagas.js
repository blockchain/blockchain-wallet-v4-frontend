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

  const fetchPaymentsAccountExchange = function * (action) {
    const { currency } = action.payload
    try {
      yield call(waitForUserData)
      const isExchangeAccountLinked = (yield select(
        selectors.modules.profile.isExchangeAccountLinked
      )).getOrElse(false)
      if (!isExchangeAccountLinked)
        throw new Error('Wallet is not linked to Exchange')
      yield put(A.fetchPaymentsAccountExchangeLoading(currency))
      const data = yield call(api.getPaymentsAccountExchange, currency)
      yield put(A.fetchPaymentsAccountExchangeSuccess(currency, data))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'fetchPaymentsAccountExchange',
          e
        )
      )
      if (e.type === BAD_2FA) {
        yield put(
          A.fetchPaymentsAccountExchangeSuccess(currency, { address: e.type })
        )
      } else {
        yield put(A.fetchPaymentsAccountExchangeFailure(currency, e))
      }
    }
  }

  return {
    fetchPaymentsAccountExchange
  }
}
