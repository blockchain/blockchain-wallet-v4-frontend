import { call, put, select, all, take } from 'redux-saga/effects'
import { contains, equals, head, keys, last, path, prop, propOr } from 'ramda'

import { Remote } from 'blockchain-wallet-v4'
import { actions, actionTypes, selectors, model } from 'data'
import {
  EXCHANGE_FORM,
  CONFIRM_FORM,
  NO_ADVICE_ERROR,
  NO_LIMITS_ERROR,
  getTargetCoinsPairedToSource,
  getSourceCoinsPairedToTarget
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

export const logLocation = 'exchange/sagas'

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
    yield call(fetchTargetFees)
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

  const fetchTargetFees = function*() {
    try {
      yield put(A.fetchTargetFeesLoading())
      const form = yield select(formValueSelector)
      const targetCoin = path(['target', 'coin'], form)
      const { fee } = yield call(api.fetchTradeCounterFees, targetCoin)
      yield put(A.fetchTargetFeesSuccess(fee))
    } catch (e) {
      const description = propOr('', 'description', e)
      yield put(A.fetchTargetFeesError(description))
    }
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
    try {
      const form = yield select(formValueSelector)
      const source = prop('source', payload)
      const sourceCoin = prop('coin', source)
      const targetCoin = path(['target', 'coin'], form)
      const prevSoureCoin = path(['source', 'coin'], form)
      yield put(actions.form.change(EXCHANGE_FORM, 'source', source))

      const pairs = (yield select(
        selectors.modules.rates.getAvailablePairs
      )).getOrElse([])
      const pairedCoins = getTargetCoinsPairedToSource(sourceCoin, pairs)
      let newTargetCoin = null
      if (equals(sourceCoin, targetCoin))
        newTargetCoin = contains(prevSoureCoin, pairedCoins)
          ? prevSoureCoin
          : last(pairedCoins)
      if (!contains(targetCoin, pairedCoins)) newTargetCoin = last(pairedCoins)
      if (newTargetCoin) {
        const newTarget = yield call(getDefaultAccount, newTargetCoin)
        yield put(actions.form.change(EXCHANGE_FORM, 'target', newTarget))
      }

      yield call(startValidation)
      yield call(unsubscribeFromCurrentAdvice, form)
      yield call(changeSubscription, true)
      yield call(clearMinMax)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'changeSource', e))
    }
  }

  const changeTarget = function*({ payload }) {
    try {
      const form = yield select(formValueSelector)
      const sourceCoin = path(['source', 'coin'], form)
      const target = prop('target', payload)
      const targetCoin = prop('coin', target)
      const prevTargetCoin = path(['target', 'coin'], form)
      yield put(actions.form.change(EXCHANGE_FORM, 'target', target))

      const pairs = (yield select(
        selectors.modules.rates.getAvailablePairs
      )).getOrElse([])
      const pairedCoins = getSourceCoinsPairedToTarget(targetCoin, pairs)
      let newSourceCoin = null
      if (equals(sourceCoin, targetCoin))
        newSourceCoin = contains(prevTargetCoin, pairedCoins)
          ? prevTargetCoin
          : head(pairedCoins)
      if (!contains(sourceCoin, pairedCoins)) newSourceCoin = head(pairedCoins)
      const newSource = yield call(getDefaultAccount, newSourceCoin)
      yield put(actions.form.change(EXCHANGE_FORM, 'source', newSource))

      yield call(startValidation)
      yield call(unsubscribeFromCurrentAdvice, form)
      yield call(changeSubscription, true)
      yield call(fetchTargetFees)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'changeTarget', e))
    }
  }

  const changeAmount = function*({ payload }) {
    try {
      const { amount } = payload
      const { fix } = yield select(formValueSelector)

      yield put(
        actions.form.change(EXCHANGE_FORM, mapFixToFieldName(fix), amount)
      )
      yield call(startValidation)
      yield call(changeSubscription)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'changeAmount', e))
    }
  }

  const changeFix = function*({ payload }) {
    try {
      const form = yield select(formValueSelector)
      const { fix } = payload
      const { source, target } = form
      const pair = formatPair(source.coin, target.coin)
      const newInputField = mapFixToFieldName(fix)
      const newInputAmount = (yield select(S.getAmounts(pair)))
        .map(prop(newInputField))
        .getOrElse(0)
      yield put(actions.form.change(EXCHANGE_FORM, 'fix', fix))
      yield put(
        actions.form.change(EXCHANGE_FORM, newInputField, newInputAmount)
      )
      yield call(startValidation)
      yield call(changeSubscription)
      yield call(updateMinMax)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'changeFix', e))
    }
  }

  const swapFieldValue = function*() {
    try {
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
      yield call(fetchTargetFees)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'swapFieldValue', e))
    }
  }

  const confirm = function*() {
    try {
      yield put(actions.form.clearSubmitErrors(CONFIRM_FORM))
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
      yield put(actions.form.stopSubmit(CONFIRM_FORM, { _error: e }))
    }
  }

  const clearSubscriptions = function*() {
    try {
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
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'clearSubscriptions', e)
      )
    }
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
