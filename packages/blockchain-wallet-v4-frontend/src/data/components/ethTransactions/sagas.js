import { equals, path } from 'ramda'
import { put, select } from 'redux-saga/effects'

import { actions, model, selectors } from 'data'
import * as C from 'services/alerts'

export default () => {
  const { WALLET_TX_SEARCH } = model.form
  const logLocation = 'components/ethTransactions/sagas'
  //
  // ETH
  //
  const initialized = function* () {
    try {
      const initialValues = {
        search: '',
        status: ''
      }
      yield put(actions.form.initialize(WALLET_TX_SEARCH, initialValues))
      yield put(actions.core.data.eth.fetchTransactions(null, true))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initialized', e))
    }
  }

  const loadMore = function* () {
    try {
      yield put(actions.core.data.eth.fetchTransactions())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'loadMore', e))
    }
  }

  const formChanged = function* (action) {
    try {
      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      if (!equals(WALLET_TX_SEARCH, form)) return
      switch (field) {
        case 'source':
          yield put(actions.core.data.eth.fetchTransactions())
          break
        default:
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'formChanged', e))
    }
  }

  //
  // ERC20
  //
  const initializedErc20 = function* (action) {
    try {
      const { token } = action.payload
      const initialValues = {
        search: '',
        status: ''
      }
      yield put(actions.form.initialize(WALLET_TX_SEARCH, initialValues))
      yield put(actions.core.data.eth.fetchErc20Transactions(token, true))
      const lowEthBalance = yield select(selectors.core.data.eth.getLowEthBalanceWarning())
      if (lowEthBalance) {
        yield put(actions.alerts.displayWarning(C.ETH_LOW_BALANCE_WARNING))
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initializedErc20', e))
    }
  }

  const loadMoreErc20 = function* (action) {
    try {
      const { token } = action.payload
      yield put(actions.core.data.eth.fetchErc20Transactions(token))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'loadMoreErc20', e))
    }
  }

  return {
    formChanged,
    initialized,
    initializedErc20,
    loadMore,
    loadMoreErc20
  }
}
