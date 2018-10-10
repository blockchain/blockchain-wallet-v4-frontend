import { call, put, select } from 'redux-saga/effects'
import { contains, equals, prop } from 'ramda'
import * as actions from '../../actions'
import * as selectors from '../../selectors'

export default () => {
  const refreshClicked = function*() {
    try {
      yield put(actions.core.data.bch.fetchData())
      yield put(actions.core.data.bitcoin.fetchData())
      yield put(actions.core.data.ethereum.fetchData())
      yield put(actions.core.data.bch.fetchRates())
      yield put(actions.core.data.bitcoin.fetchRates())
      yield put(actions.core.data.ethereum.fetchRates())
      const pathname = yield select(selectors.router.getPathname)
      switch (true) {
        case contains('/bch/transactions', pathname):
          yield call(refreshBchTransactions)
          break
        case contains('/btc/transactions', pathname):
          yield call(refreshBtcTransactions)
          break
        case contains('/eth/transactions', pathname):
          yield call(refreshEthTransactions)
          break
        case contains('/lockbox/', pathname):
          yield put(actions.lockbox.initializeDashboard(pathname.split('/')[3]))
          break
        default:
          yield put(actions.core.data.bitcoin.fetchTransactions('', true))
          yield put(actions.core.data.ethereum.fetchTransactions(null, true))
          yield put(actions.core.data.bch.fetchTransactions('', true))
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          'components/refresh/sagas',
          'refresh',
          'Refresh failed.'
        )
      )
    }
  }

  const refreshBchTransactions = function*() {
    const formValues = yield select(
      selectors.form.getFormValues('bchTransactions')
    )
    const source = prop('source', formValues)
    const onlyShow = equals(source, 'all') ? '' : source.xpub || source.address
    yield put(actions.core.data.bch.fetchTransactions(onlyShow, true))
  }

  const refreshBtcTransactions = function*() {
    const formValues = yield select(
      selectors.form.getFormValues('btcTransactions')
    )
    const source = prop('source', formValues)
    const onlyShow = equals(source, 'all') ? '' : source.xpub || source.address
    yield put(actions.core.data.bitcoin.fetchTransactions(onlyShow, true))
  }

  const refreshEthTransactions = function*() {
    yield put(actions.core.data.ethereum.fetchTransactions(null, true))
  }

  return {
    refreshClicked,
    refreshBchTransactions,
    refreshBtcTransactions
  }
}
