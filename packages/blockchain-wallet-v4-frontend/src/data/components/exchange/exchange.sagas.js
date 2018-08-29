import { call, put, select } from 'redux-saga/effects'
import { equals, path, prop } from 'ramda'

import { actions, selectors, model } from 'data'
import { EXCHANGE_FORM, formatPair } from './model'
import utils from './sagas.utils'
import * as S from './selectors'

export default ({ api, coreSagas, options, networks }) => {
  const { mapFixToFieldName, swapBaseAndCounter } = model.rates
  const formValueSelector = selectors.form.getFormValues(EXCHANGE_FORM)
  const { selectOtherAccount } = utils({
    api,
    coreSagas,
    options,
    networks
  })

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
        form[mapFixToFieldName(fix)],
        fix,
        fiatCurrency
      )
    )
  }

  const swapFieldValue = function*(form) {
    const { fix, source, target } = form
    const pair = formatPair(source.coin, target.coin)
    const oppositeFix = swapBaseAndCounter(fix)
    const oppositeField = mapFixToFieldName(oppositeFix)
    const oppositeFieldAmount = (yield select(S.getAmounts(pair)))
      .map(prop(oppositeField))
      .getOrElse(0)
    yield put(actions.form.change(EXCHANGE_FORM, 'fix', oppositeFix))
    yield put(
      actions.form.change(EXCHANGE_FORM, oppositeField, oppositeFieldAmount)
    )
  }

  const changeSource = function*({ payload }) {
    const form = yield select(formValueSelector)
    const source = prop('source', payload)
    const sourceCoin = prop('coin', source)
    const targetCoin = path(['target', 'coin'], form)
    yield put(actions.form.change(EXCHANGE_FORM, 'source', source))
    if (equals(sourceCoin, targetCoin)) {
      const newTarget = yield call(selectOtherAccount, targetCoin)
      yield put(actions.form.change(EXCHANGE_FORM, 'target', newTarget))
      yield call(swapFieldValue, form)
    }
    yield call(changeSubscription)
  }

  const changeTarget = function*({ payload }) {
    const form = yield select(formValueSelector)
    const sourceCoin = path(['source', 'coin'], form)
    const target = prop('target', payload)
    const targetCoin = prop('coin', target)
    yield put(actions.form.change(EXCHANGE_FORM, 'target', target))
    if (equals(sourceCoin, targetCoin)) {
      const newSource = yield call(selectOtherAccount, sourceCoin)
      yield put(actions.form.change(EXCHANGE_FORM, 'source', newSource))
      yield call(swapFieldValue, form)
    }
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
      actions.form.change(EXCHANGE_FORM, 'sourceFiat', sourceFiatAmount)
    )
    yield call(changeSubscription)
  }

  const changeTargetFiatAmount = function*({ payload }) {
    const { targetFiatAmount } = payload
    yield put(
      actions.form.change(EXCHANGE_FORM, 'targetFiat', targetFiatAmount)
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
