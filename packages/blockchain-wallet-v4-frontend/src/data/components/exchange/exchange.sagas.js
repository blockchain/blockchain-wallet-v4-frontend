import { call, put, select, all } from 'redux-saga/effects'
import { equals, flip, keys, path, prop } from 'ramda'

import { actions, selectors, model } from 'data'
import { EXCHANGE_FORM, CONFIRM_FORM } from './model'
import utils from './sagas.utils'
import * as S from './selectors'
import { promptForSecondPassword } from 'services/SagaService'
import { selectReceiveAddress } from '../utils/sagas'

export default ({ api, coreSagas, options, networks }) => {
  const { mapFixToFieldName, configEquals, formatPair } = model.rates
  const formValueSelector = selectors.form.getFormValues(EXCHANGE_FORM)
  const { getDefaultAccount, createPayment } = utils({
    api,
    coreSagas,
    options,
    networks
  })

  const exchangeFormInitialized = function*() {
    yield put(actions.modules.rates.fetchAvailablePairs())
    const { source, target } = yield select(formValueSelector)
    const fiatCurrency = (yield select(
      selectors.core.settings.getCurrency
    )).getOrElse(null)
    yield call(changeRatesSubscription, source, target, fiatCurrency)
  }

  const changeSubscription = function*() {
    const form = yield select(formValueSelector)
    const { source, target, fix } = form
    const volume = form[mapFixToFieldName(fix)]
    const fiatCurrency = (yield select(
      selectors.core.settings.getCurrency
    )).getOrElse(null)
    yield call(
      changeAdviceSubscription,
      volume,
      fix,
      source,
      target,
      fiatCurrency
    )
    yield call(changeRatesSubscription, source, target, fiatCurrency)
  }

  const changeAdviceSubscription = function*(
    volume,
    fix,
    source,
    target,
    fiatCurrency
  ) {
    const pair = formatPair(source.coin, target.coin)
    const currentConfig = yield select(
      selectors.modules.rates.getPairConfig(pair)
    )

    if (configEquals(currentConfig, { volume, fix, fiatCurrency })) return

    yield put(
      actions.modules.rates.subscribeToAdvice(pair, volume, fix, fiatCurrency)
    )
  }

  const changeRatesSubscription = function*(source, target, fiatCurrency) {
    const pairs = [
      formatPair(source.coin, target.coin),
      formatPair(source.coin, fiatCurrency),
      formatPair(target.coin, fiatCurrency)
    ]
    const currentPairs = (yield select(selectors.modules.rates.getBestRates))
      .map(keys)
      .getOrElse([])

    if (equals(pairs, currentPairs)) return

    yield put(actions.modules.rates.subscribeToRates(pairs))
  }

  const unsubscribeFromCurrentAdvice = function*({ source, target }) {
    const pair = formatPair(source.coin, target.coin)
    yield put(actions.modules.rates.unsubscribeFromAdvice(pair))
  }

  const changeSource = function*({ payload }) {
    const form = yield select(formValueSelector)
    const source = prop('source', payload)
    const sourceCoin = prop('coin', source)
    const targetCoin = path(['target', 'coin'], form)
    const prevSoureCoin = path(['source', 'coin'], form)
    yield put(actions.form.change(EXCHANGE_FORM, 'source', source))
    if (equals(sourceCoin, targetCoin)) {
      const newTarget = yield call(getDefaultAccount, prevSoureCoin)
      yield put(actions.form.change(EXCHANGE_FORM, 'target', newTarget))
    }
    yield call(unsubscribeFromCurrentAdvice, form)
    yield call(changeSubscription)
  }

  const changeTarget = function*({ payload }) {
    const form = yield select(formValueSelector)
    const sourceCoin = path(['source', 'coin'], form)
    const target = prop('target', payload)
    const targetCoin = prop('coin', target)
    const prevTargetCoin = path(['target', 'coin'], form)
    yield put(actions.form.change(EXCHANGE_FORM, 'target', target))
    if (equals(sourceCoin, targetCoin)) {
      const newSource = yield call(getDefaultAccount, prevTargetCoin)
      yield put(actions.form.change(EXCHANGE_FORM, 'source', newSource))
    }
    yield call(unsubscribeFromCurrentAdvice, form)
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
      const sourceCoin = source.coin
      const targetCoin = target.coin
      const pair = formatPair(sourceCoin, targetCoin)
      const amounts = (yield select(S.getAmounts(pair))).getOrFail()
      const fieldName = mapFixToFieldName(fix)
      const coinField = flip(prop)({
        sourceAmount: 'sourceAmount',
        targetAmount: 'targetAmount',
        sourceFiat: 'sourceAmount',
        targetFiat: 'targetAmount'
      })(fieldName)
      const volume = amounts[coinField]
      const currency = flip(prop)({
        sourceAmount: sourceCoin,
        targetAmount: targetCoin
      })(coinField)

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
      yield put(actions.router.push('/exchange/history'))
    } catch (e) {
      yield put(actions.form.stopSubmit(CONFIRM_FORM, e))
    }
  }

  const clearSubscriptions = function*() {
    const pairs = yield select(selectors.modules.rates.getActivePairs)
    yield all(
      pairs.map(({ pair }) =>
        put(actions.modules.rates.unsubscribeFromAdvice(pair))
      )
    )
    yield all(
      pairs.map(({ pair }) => put(actions.modules.rates.removeAdvice(pair)))
    )
    yield put(actions.modules.rates.unsubscribeFromRates())
    yield put(actions.form.reset(EXCHANGE_FORM))
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
    confirm,
    clearSubscriptions
  }
}
