import { call, put, select } from 'redux-saga/effects'
import { equals, prop, path } from 'ramda'

import { actions, selectors } from 'data'
import { EXCHANGE_FORM } from './model'
import utils from './sagas.utils'

const logLocation = 'components/exchange/sagas/exchange'
export default ({ api, coreSagas, options }) => {
  const { selectOtherAccount, resetForm } = utils({ api, coreSagas, options })

  const exchangeFormInitialized = function*() {
    yield put(actions.modules.rates.fetchAvailablePairs())
  }

  const swapClicked = function*() {
    try {
      const form = yield select(selectors.form.getFormValues(EXCHANGE_FORM))
      const source = prop('source', form)
      const target = prop('target', form)
      yield put(actions.form.change(EXCHANGE_FORM, 'source', target))
      yield put(actions.form.change(EXCHANGE_FORM, 'target', source))
      yield call(resetForm)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'swapClicked', e))
    }
  }

  const changeSource = function*({ payload }) {
    const form = yield select(selectors.form.getFormValues(EXCHANGE_FORM))
    const sourceCoin = path(['source', 'coin'], payload)
    const targetCoin = path(['target', 'coin'], form)
    if (equals(sourceCoin, targetCoin)) {
      const newTarget = yield call(selectOtherAccount, targetCoin)
      yield put(actions.form.change(EXCHANGE_FORM, 'target', newTarget))
    }
    yield call(resetForm)
  }

  const changeTarget = function*({ payload }) {
    const form = yield select(selectors.form.getFormValues(EXCHANGE_FORM))
    const sourceCoin = path(['source', 'coin'], form)
    const targetCoin = path(['target', 'coin'], payload)
    if (equals(sourceCoin, targetCoin)) {
      const newSource = yield call(selectOtherAccount, sourceCoin)
      yield put(actions.form.change(EXCHANGE_FORM, 'source', newSource))
    }
    yield call(resetForm)
  }

  return {
    exchangeFormInitialized,
    changeSource,
    changeTarget,
    swapClicked
  }
}
