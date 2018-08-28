import { call, put, select } from 'redux-saga/effects'
import { equals, path, prop } from 'ramda'

import { actions, selectors, model } from 'data'
import { EXCHANGE_FORM, formatPair } from './model'
import utils from './sagas.utils'

export default ({ api, coreSagas, options, networks }) => {
  const { BASE, COUNTER, BASE_IN_FIAT, COUNTER_IN_FIAT } = model.rates.FIX_TYPES
  const formValueSelector = selectors.form.getFormValues(EXCHANGE_FORM)
  const { selectOtherAccount, resetForm } = utils({
    api,
    coreSagas,
    options,
    networks
  })
  const swapFix = oldFix => {
    switch (oldFix) {
      case BASE:
        return COUNTER
      case COUNTER:
        return BASE
      case BASE_IN_FIAT:
        return COUNTER_IN_FIAT
      case COUNTER_IN_FIAT:
        return BASE_IN_FIAT
    }
  }
  const getVolumeWithFix = ({
    sourceAmount,
    targetAmount,
    sourceFiat,
    targetFiat,
    fix
  }) => {
    switch (fix) {
      case BASE:
        return sourceAmount
      case COUNTER:
        return targetAmount
      case BASE_IN_FIAT:
        return sourceFiat
      case COUNTER_IN_FIAT:
        return targetFiat
    }
  }

  const exchangeFormInitialized = function*() {
    yield put(actions.modules.rates.fetchAvailablePairs())
  }

  const changeSubscription = function*() {
    const form = yield select(formValueSelector)
    const { fix, source, target } = form
    const pair = formatPair(source.coin, target.coin)
    const fiatCurrency = (yield select(
      selectors.core.settings.getCurrency
    )).getOrElse(null)
    yield put(actions.modules.rates.unsubscribeFromRate(pair))
    yield put(
      actions.modules.rates.subscribeToRate(
        pair,
        getVolumeWithFix(form),
        fix,
        fiatCurrency
      )
    )
  }

  const changeSource = function*({ payload }) {
    const form = yield select(formValueSelector)
    const sourceCoin = path(['source', 'coin'], payload)
    const targetCoin = path(['target', 'coin'], form)
    if (equals(sourceCoin, targetCoin)) {
      const newTarget = yield call(selectOtherAccount, targetCoin)
      const fix = prop('fix', form)
      yield put(actions.form.change(EXCHANGE_FORM, 'target', newTarget))
      yield put(actions.form.change(EXCHANGE_FORM, 'fix', swapFix(fix)))
    }
    yield call(resetForm)
    yield call(changeSubscription)
  }

  const changeTarget = function*({ payload }) {
    const form = yield select(formValueSelector)
    const sourceCoin = path(['source', 'coin'], form)
    const targetCoin = path(['target', 'coin'], payload)
    if (equals(sourceCoin, targetCoin)) {
      const newSource = yield call(selectOtherAccount, sourceCoin)
      const fix = prop('fix', form)
      yield put(actions.form.change(EXCHANGE_FORM, 'source', newSource))
      yield put(actions.form.change(EXCHANGE_FORM, 'fix', swapFix(fix)))
    }
    yield call(resetForm)
    yield call(changeSubscription)
  }

  const changeSourceAmount = function*({ payload }) {
    const { sourceAmount } = payload
    yield put(actions.form.change(EXCHANGE_FORM, 'sourceAmount', sourceAmount))
    yield call(changeSubscription)
  }

  const changeTargetAmount = function*({ payload }) {
    const { targetAmount } = payload
    yield put(actions.form.change(EXCHANGE_FORM, 'targetAmount', targetAmount))
    yield call(changeSubscription)
  }

  const changeSourceFiatAmount = function*({ payload }) {
    const { sourceFiatAmount } = payload
    yield put(
      actions.form.change(EXCHANGE_FORM, 'sourceFiatAmount', sourceFiatAmount)
    )
    yield call(changeSubscription)
  }

  const changeTargetFiatAmount = function*({ payload }) {
    const { targetFiatAmount } = payload
    yield put(
      actions.form.change(EXCHANGE_FORM, 'targetFiatAmount', targetFiatAmount)
    )
    yield call(changeSubscription)
  }

  return {
    exchangeFormInitialized,
    changeSource,
    changeTarget,
    changeSourceAmount,
    changeTargetAmount,
    changeSourceFiatAmount,
    changeTargetFiatAmount
  }
}
