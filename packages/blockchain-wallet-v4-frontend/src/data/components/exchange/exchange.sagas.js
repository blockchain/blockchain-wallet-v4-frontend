import { call, fork, put, select, all, take } from 'redux-saga/effects'
import { equals, flip, keys, path, prop } from 'ramda'

import { Remote } from 'blockchain-wallet-v4'
import { actions, actionTypes, selectors, model } from 'data'
import {
  EXCHANGE_FORM,
  CONFIRM_FORM,
  NO_ADVICE_ERROR,
  NO_LIMITS_ERROR,
  MINIMUM_ERROR,
  BALANCE_ERROR,
  DAILY_ERROR,
  WEEKLY_ERROR,
  ANNUAL_ERROR,
  ORDER_ERROR
} from './model'
import utils from './sagas.utils'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import { promptForSecondPassword } from 'services/SagaService'
import { selectReceiveAddress } from '../utils/sagas'
import { isAmountBelowMinimum, isAmountAboveMaximum } from './services'

export default ({ api, coreSagas, options, networks }) => {
  const {
    mapFixToFieldName,
    configEquals,
    formatPair,
    swapBaseAndCounter,
    FIX_TYPES
  } = model.rates
  const formValueSelector = selectors.form.getFormValues(EXCHANGE_FORM)
  const { calculateEffectiveBalance, getDefaultAccount, createPayment } = utils(
    {
      api,
      coreSagas,
      options,
      networks
    }
  )

  const getFiatCurrency = function*() {
    return (yield select(selectors.core.settings.getCurrency)).getOrElse(null)
  }

  const exchangeFormInitialized = function*() {
    yield put(actions.modules.rates.fetchAvailablePairs())
    const { source, target } = yield select(formValueSelector)
    const fiatCurrency = yield call(getFiatCurrency)
    yield call(updateLimits)
    yield call(changeRatesSubscription, source, target, fiatCurrency)
  }

  const validateVolume = function (limits, volume) {
    const minOrder = prop('minOrder', limits)
    const balanceMax = prop('balanceMax', limits)
    const maxOrder = prop('maxOrder', limits)
    const dailyMax = path(['daily', 'available'], limits)
    const weeklyMax = path(['weekly', 'available'], limits)
    const annualMax = path(['annual', 'available'], limits)

    if (isAmountBelowMinimum(volume, minOrder)) throw MINIMUM_ERROR
    if (isAmountAboveMaximum(volume, balanceMax)) throw BALANCE_ERROR
    if (isAmountBelowMinimum(volume, dailyMax)) throw DAILY_ERROR
    if (isAmountBelowMinimum(volume, weeklyMax)) throw WEEKLY_ERROR
    if (isAmountBelowMinimum(volume, annualMax)) throw ANNUAL_ERROR
    if (isAmountAboveMaximum(volume, maxOrder)) throw ORDER_ERROR
  }

  const getLimits = function*(currency) {
    const limitsR = yield select(S.getLimits)
    if (Remote.Loading.is(limitsR))
      return path(
        ['payload', 'limits', currency],
        yield take(AT.FETCH_LIMITS_SUCCESS)
      )

    return limitsR.map(prop(currency)).getOrFail(NO_LIMITS_ERROR)
  }

  const getSourceAmount = function*(pair) {
    const amountsR = (yield select(S.getAmounts(pair))).map(
      prop('sourceAmount')
    )

    if (Remote.Loading.is(amountsR)) {
      yield take(actionTypes.modules.rates.PAIR_UPDATED)
    }

    return (yield select(S.getAmounts(pair)))
      .map(prop('sourceAmount'))
      .getOrFail(NO_ADVICE_ERROR)
  }

  const validateForm = function*() {
    yield call(tryToStartValidation)
    const form = yield select(formValueSelector)
    const { fix, source, target } = form
    const sourceCoin = prop('coin', source)
    const targetCoin = prop('coin', target)
    const formVolume = form[mapFixToFieldName(fix)]
    const fiatCurrency = yield call(getFiatCurrency)
    const mapFieldToCoin = flip(prop)({
      sourceAmount: sourceCoin,
      sourceFiat: fiatCurrency,
      targetAmount: targetCoin,
      targetFiat: fiatCurrency
    })
    const pair = formatPair(sourceCoin, targetCoin)
    try {
      const sourceVolume = yield call(getSourceAmount, pair)
      const volume = fix === FIX_TYPES.BASE ? formVolume : sourceVolume
      const limits = yield call(getLimits, mapFieldToCoin('sourceAmount'))
      yield call(validateVolume, limits, volume)
    } catch (error) {
      yield put(
        actions.form.stopAsyncValidation(EXCHANGE_FORM, {
          _error: error
        })
      )
    }
  }

  const validateOnRatesChange = function*({ payload }) {
    const { pair } = payload
    const form = yield select(formValueSelector)
    const fix = prop('fix', form)
    const sourceCoin = path(['source', 'coin'], form)
    const targetCoin = path(['target', 'coin'], form)

    if (fix && formatPair(sourceCoin, targetCoin) === pair) {
      yield call(validateForm)
    }
  }

  const updateLimits = function*() {
    try {
      yield put(A.fetchLimitsLoading())
      const form = yield select(formValueSelector)
      const { source } = form
      const sourceCoin = prop('coin', source)
      const balance = yield call(calculateEffectiveBalance, source)
      const fiatCurrency = yield call(getFiatCurrency)
      const [sourceLimits, fiatLimits] = yield all([
        call(api.fetchLimits, sourceCoin),
        call(api.fetchLimits, fiatCurrency)
      ])
      sourceLimits.balanceMax = balance
      if (isAmountBelowMinimum(balance, sourceLimits.maxOrder)) {
        sourceLimits.maxOrder = balance
      }
      yield put(
        A.fetchLimitsSuccess({
          [sourceCoin]: sourceLimits,
          [fiatCurrency]: fiatLimits
        })
      )
    } catch (e) {
      yield put(A.fetchLimitsError(e))
      yield put(
        actions.form.stopAsyncValidation(EXCHANGE_FORM, {
          _error: NO_LIMITS_ERROR
        })
      )
    }
  }

  const changeSubscription = function*(pairChanged = false) {
    const form = yield select(formValueSelector)
    const { source, target, fix } = form
    const fiatCurrency = yield call(getFiatCurrency)
    const volume = form[mapFixToFieldName(fix)]
    yield call(
      changeAdviceSubscription,
      volume,
      fix,
      source,
      target,
      fiatCurrency,
      pairChanged
    )
    yield call(changeRatesSubscription, source, target, fiatCurrency)
  }

  const changeAdviceSubscription = function*(
    volume,
    fix,
    source,
    target,
    fiatCurrency,
    pairChanged
  ) {
    const pair = formatPair(source.coin, target.coin)
    const currentConfig = yield select(
      selectors.modules.rates.getPairConfig(pair)
    )

    if (
      !pairChanged &&
      configEquals(currentConfig, { volume, fix, fiatCurrency })
    ) {
      return yield call(validateForm)
    }

    yield put(
      actions.modules.rates.subscribeToAdvice(pair, volume, fix, fiatCurrency)
    )
  }

  const changeRatesSubscription = function*(source, target, fiatCurrency) {
    const pairs = [
      formatPair(source.coin, target.coin),
      formatPair(target.coin, source.coin),
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

  const tryToStartValidation = function*() {
    const { asyncValidating } = yield select(formValueSelector)
    if (!asyncValidating) {
      yield put(actions.form.clearSubmitErrors(EXCHANGE_FORM))
      yield put(actions.form.startAsyncValidation(EXCHANGE_FORM))
    }
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
    yield fork(updateLimits)
    yield call(unsubscribeFromCurrentAdvice, form)
    yield call(changeSubscription, true)
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
    yield call(changeSubscription, true)
    yield call(tryToStartValidation)
  }

  const changeSourceAmount = function*({ payload }) {
    const { sourceAmount } = payload
    yield put(actions.form.change(EXCHANGE_FORM, 'sourceAmount', sourceAmount))
    yield call(changeSubscription)
    yield call(tryToStartValidation)
  }

  const changeTargetAmount = function*({ payload }) {
    const { targetAmount } = payload
    yield put(actions.form.change(EXCHANGE_FORM, 'targetAmount', targetAmount))
    yield call(tryToStartValidation)
    yield call(changeSubscription)
  }

  const changeSourceFiatAmount = function*({ payload }) {
    const { sourceFiatAmount } = payload
    yield put(
      actions.form.change(EXCHANGE_FORM, 'sourceFiat', sourceFiatAmount)
    )
    yield call(tryToStartValidation)
    yield call(changeSubscription)
  }

  const changeTargetFiatAmount = function*({ payload }) {
    const { targetFiatAmount } = payload
    yield put(
      actions.form.change(EXCHANGE_FORM, 'targetFiat', targetFiatAmount)
    )
    yield call(tryToStartValidation)
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
    yield call(tryToStartValidation)
    yield call(changeSubscription)
  }

  const swapFieldValue = function*() {
    yield call(updateLimits)
    const form = yield select(formValueSelector)
    const { fix, source, target } = form
    const pair = formatPair(source.coin, target.coin)
    const currentField = mapFixToFieldName(fix)
    const currentFieldAmount = form[currentField]
    const oppositeFix = swapBaseAndCounter(fix)
    const oppositeField = mapFixToFieldName(oppositeFix)
    const oppositeFieldAmount = (yield select(S.getAmounts(pair)))
      .map(prop(oppositeField))
      .getOrElse(0)
    yield put(actions.form.change(EXCHANGE_FORM, 'source', target))
    yield put(actions.form.change(EXCHANGE_FORM, 'target', source))
    yield put(
      actions.form.change(EXCHANGE_FORM, currentField, oppositeFieldAmount)
    )
    yield put(
      actions.form.change(EXCHANGE_FORM, oppositeField, currentFieldAmount)
    )
    yield call(unsubscribeFromCurrentAdvice, { source, target })
    yield call(tryToStartValidation)
    yield call(changeSubscription, true)
  }

  const confirm = function*() {
    try {
      yield put(actions.form.startSubmit(CONFIRM_FORM))
      const form = yield select(formValueSelector)
      const { source, target } = form
      const sourceCoin = source.coin
      const targetCoin = target.coin
      const pair = formatPair(sourceCoin, targetCoin)
      const quote = (yield select(
        selectors.modules.rates.getPairQuote(pair)
      )).getOrFail(NO_ADVICE_ERROR)

      const refundAddress = yield call(selectReceiveAddress, source, networks)
      const destinationAddress = yield call(
        selectReceiveAddress,
        target,
        networks
      )
      const { withdrawalAddress, depositAddress, quantity } = yield call(
        api.executeTrade,
        quote,
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
    clearSubscriptions,
    swapFieldValue,
    updateLimits,
    validateOnRatesChange,
    validateForm
  }
}
