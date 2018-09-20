import { call, put, select, all, take } from 'redux-saga/effects'
import { equals, keys, path, prop } from 'ramda'

import { Remote } from 'blockchain-wallet-v4'
import { actions, actionTypes, selectors, model } from 'data'
import {
  EXCHANGE_FORM,
  CONFIRM_FORM,
  NO_ADVICE_ERROR,
  NO_LIMITS_ERROR
} from './model'
import utils from './sagas.utils'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import { promptForSecondPassword } from 'services/SagaService'
import { selectReceiveAddress } from '../utils/sagas'
import {
  getEffectiveBalanceStandard,
  divide,
  validateVolume,
  addBalanceLimit,
  getCurrentMin,
  getCurrentMax
} from './services'

export default ({ api, coreSagas, options, networks }) => {
  const {
    mapFixToFieldName,
    configEquals,
    formatPair,
    swapBaseAndCounter,
    FIX_TYPES
  } = model.rates
  const formValueSelector = selectors.form.getFormValues(EXCHANGE_FORM)
  const {
    calculateEffectiveBalanceMemo,
    getDefaultAccount,
    createPayment
  } = utils({
    api,
    coreSagas,
    options,
    networks
  })

  const getFiatCurrency = function*() {
    return (yield select(selectors.core.settings.getCurrency)).getOrElse(null)
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

  const getBestRates = function*() {
    const ratesR = yield select(selectors.modules.rates.getBestRates)
    if (Remote.Loading.is(ratesR) || Remote.NotAsked.is(ratesR)) {
      return yield take(actionTypes.modules.rates.UPDATE_BEST_RATES)
    }
    return ratesR.getOrFail(NO_ADVICE_ERROR)
  }

  const getFiatBalance = function*(fiatCurrency) {
    const form = yield select(formValueSelector)
    const source = prop('source', form)
    const sourceCoin = prop('coin', source)
    const effectiveBalance = yield call(calculateEffectiveBalanceMemo, source)
    const balance = getEffectiveBalanceStandard(sourceCoin, effectiveBalance)
    const rates = yield call(getBestRates)
    const rate = path([formatPair(fiatCurrency, sourceCoin), 'price'], rates)
    return divide(balance, rate, 2)
  }

  const getSourceFiatAmount = function*(pair) {
    const amountsR = (yield select(S.getAmounts(pair))).map(prop('sourceFiat'))

    if (Remote.Loading.is(amountsR)) {
      yield take(actionTypes.modules.rates.PAIR_UPDATED)
    }

    return (yield select(S.getAmounts(pair)))
      .map(prop('sourceFiat'))
      .getOrFail(NO_ADVICE_ERROR)
  }

  const exchangeFormInitialized = function*() {
    yield put(actions.modules.rates.fetchAvailablePairs())
    const { source, target } = yield select(formValueSelector)
    const fiatCurrency = yield call(getFiatCurrency)
    yield call(changeRatesSubscription, source, target, fiatCurrency)
    yield call(fetchLimits)
  }

  const validateForm = function*() {
    yield call(startValidation)
    const form = yield select(formValueSelector)
    const { fix, source, target } = form
    const sourceCoin = prop('coin', source)
    const targetCoin = prop('coin', target)
    const formVolume = form[mapFixToFieldName(fix)]
    const fiatCurrency = yield call(getFiatCurrency)
    const pair = formatPair(sourceCoin, targetCoin)
    try {
      const sourceFiatVolume = yield call(getSourceFiatAmount, pair)
      const volume =
        fix === FIX_TYPES.BASE_IN_FIAT ? formVolume : sourceFiatVolume
      const limits = yield call(getLimits, fiatCurrency)
      yield call(validateVolume, limits, volume)
      yield put(actions.form.stopAsyncValidation(EXCHANGE_FORM))
    } catch (error) {
      yield put(
        actions.form.stopAsyncValidation(EXCHANGE_FORM, {
          _error: error
        })
      )
    }
  }

  const onQuoteChange = function*({ payload }) {
    const { pair } = payload
    const form = yield select(formValueSelector)
    const fix = prop('fix', form)
    const sourceCoin = path(['source', 'coin'], form)
    const targetCoin = path(['target', 'coin'], form)

    if (!(fix && formatPair(sourceCoin, targetCoin) === pair)) return

    yield call(validateForm)
  }

  const fetchLimits = function*() {
    try {
      yield call(startValidation)
      yield put(A.fetchLimitsLoading())
      const fiatCurrency = yield call(getFiatCurrency)
      const limits = yield call(api.fetchLimits, fiatCurrency)
      const fiatBalance = yield call(getFiatBalance, fiatCurrency)
      yield put(
        A.fetchLimitsSuccess({
          [fiatCurrency]: addBalanceLimit(fiatBalance, limits)
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

  const updateMinMax = function*() {
    try {
      const fiatCurrency = yield call(getFiatCurrency)
      const limits = yield call(getLimits, fiatCurrency)
      const sourceFiatMin = prop('minOrder', limits)
      const sourceFiatMax = prop('maxPossibleOrder', limits)
      const form = yield select(formValueSelector)
      const rates = yield call(getBestRates)
      const currentMin = getCurrentMin(form, fiatCurrency, rates, sourceFiatMin)
      const currentMax = getCurrentMax(form, fiatCurrency, rates, sourceFiatMax)
      yield put(A.setMinMax(currentMin, currentMax))
    } catch (error) {
      yield put(A.setMinMax(null, null))
      yield put(
        actions.form.stopAsyncValidation(EXCHANGE_FORM, {
          _error: error
        })
      )
    }
  }

  const clearMinMax = function*() {
    yield put(A.setMinMax(null, null))
  }

  const useMin = function*() {
    const min = yield select(S.getMin)
    yield put(A.changeAmount(min))
  }

  const useMax = function*() {
    const max = yield select(S.getMax)
    yield put(A.changeAmount(max))
  }

  const updateLimits = function*() {
    yield call(fetchLimits)
    yield call(validateForm)
    yield call(updateMinMax)
  }

  const onBestRatesChange = function*() {
    yield call(updateBalanceLimit)
    yield call(validateForm)
    yield call(updateMinMax)
  }

  const updateBalanceLimit = function*() {
    try {
      const fiatCurrency = yield call(getFiatCurrency)
      const limits = yield call(getLimits, fiatCurrency)
      const fiatBalance = yield call(getFiatBalance, fiatCurrency)
      yield put(
        A.fetchLimitsSuccess({
          [fiatCurrency]: addBalanceLimit(fiatBalance, limits)
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
    const sourceCoin = prop('coin', source)
    const targetCoin = prop('coin', target)
    const pairs = [
      formatPair(sourceCoin, targetCoin),
      formatPair(targetCoin, sourceCoin),
      formatPair(sourceCoin, fiatCurrency),
      formatPair(fiatCurrency, sourceCoin),
      formatPair(targetCoin, fiatCurrency),
      formatPair(fiatCurrency, targetCoin)
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

  const startValidation = function*() {
    yield put(actions.form.clearSubmitErrors(EXCHANGE_FORM))
    yield put(actions.form.startAsyncValidation(EXCHANGE_FORM))
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
    yield call(startValidation)
    yield call(unsubscribeFromCurrentAdvice, form)
    yield call(changeSubscription, true)
    yield call(clearMinMax)
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
    yield call(startValidation)
    yield call(unsubscribeFromCurrentAdvice, form)
    yield call(changeSubscription, true)
  }

  const changeAmount = function*({ payload }) {
    const { amount } = payload
    const { fix } = yield select(formValueSelector)

    yield put(
      actions.form.change(EXCHANGE_FORM, mapFixToFieldName(fix), amount)
    )
    yield call(startValidation)
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
    yield call(startValidation)
    yield call(changeSubscription)
    yield call(updateMinMax)
  }

  const swapFieldValue = function*() {
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
    yield call(startValidation)
    yield call(unsubscribeFromCurrentAdvice, { source, target })
    yield call(changeSubscription, true)
    yield call(clearMinMax)
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
    changeAmount,
    useMin,
    useMax,
    changeFix,
    confirm,
    clearSubscriptions,
    swapFieldValue,
    updateLimits,
    onBestRatesChange,
    onQuoteChange,
    validateForm
  }
}
