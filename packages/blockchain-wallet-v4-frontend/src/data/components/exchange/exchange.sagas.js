import { call, put, select } from 'redux-saga/effects'
import { equals, flip, path, prop } from 'ramda'

import { actions, selectors, model } from 'data'
import { EXCHANGE_FORM, CONFIRM_FORM, formatPair } from './model'
import utils from './sagas.utils'
import * as S from './selectors'
import { promptForSecondPassword } from 'services/SagaService'
import { selectReceiveAddress } from '../utils/sagas'

export default ({ api, coreSagas, options, networks }) => {
  const { mapFixToFieldName, swapBaseAndCounter, configEquals } = model.rates
  const formValueSelector = selectors.form.getFormValues(EXCHANGE_FORM)
  const { selectOtherAccount, createPayment } = utils({
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
    const volume = form[mapFixToFieldName(fix)]
    const fiatCurrency = (yield select(
      selectors.core.settings.getCurrency
    )).getOrElse(null)
    const currentConfig = yield select(
      selectors.modules.rates.getPairConfig(pair)
    )

    if (configEquals(currentConfig, { volume, fix, fiatCurrency })) return

    yield put(actions.modules.rates.unsubscribeFromAdvice(pair))
    yield put(
      actions.modules.rates.subscribeToAdvice(pair, volume, fix, fiatCurrency)
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

  const changeFix = function*({ payload }) {
    const form = yield select(formValueSelector)
    const { fix } = payload
    const { source, target } = form
    const pair = formatPair(source.coin, target.coin)
    const newInputField = mapFixToFieldName(fix)
    const newInputAmount = (yield select(S.getAmounts(pair)))
      .map(prop(newInputField))
      .getOrElse(0)
    yield put(actions.form.change(EXCHANGE_FORM, 'fix', fix))
    yield put(actions.form.change(EXCHANGE_FORM, newInputField, newInputAmount))
    yield call(changeSubscription)
  }

  const confirm = function*() {
    try {
      yield put(actions.form.startSubmit(CONFIRM_FORM))
      const form = yield select(formValueSelector)
      const { fix, source, target } = form
      const pair = formatPair(source.coin, target.coin)
      const fieldName = mapFixToFieldName(fix)
      const volume = form[fieldName]
      const fiatCurrency = (yield select(
        selectors.core.settings.getCurrency
      )).getOrFail()
      const currency = flip(prop)({
        sourceAmount: source.coin,
        targetAmount: target.coin,
        sourceFiat: fiatCurrency,
        targetFiat: fiatCurrency
      })(fieldName)

      const refundAddress = yield call(selectReceiveAddress, source, networks)
      const destinationAddress = yield call(
        selectReceiveAddress,
        target,
        networks
      )
      const { withdrawalAddress, depositAddress, quantity } = yield call(
        api.executeTrade,
        pair,
        volume,
        currency,
        refundAddress,
        destinationAddress
      )
      const payment = yield call(
        createPayment,
        source.coin,
        withdrawalAddress,
        depositAddress,
        quantity
      )
      const password = yield call(promptForSecondPassword)
      payment.sign(password).publish()
      yield put(actions.form.stopSubmit(CONFIRM_FORM))
    } catch (e) {
      yield put(actions.form.stopSubmit(CONFIRM_FORM, e))
    }
  }

  return {
    exchangeFormInitialized,
    changeSource,
    changeTarget,
    changeSourceAmount,
    changeTargetAmount,
    changeSourceFiatAmount,
    changeTargetFiatAmount,
    changeFix,
    confirm
  }
}
