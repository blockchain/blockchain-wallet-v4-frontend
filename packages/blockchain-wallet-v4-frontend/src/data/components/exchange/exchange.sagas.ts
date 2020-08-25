import {
  all,
  call,
  cancel,
  delay,
  fork,
  put,
  select,
  spawn,
  take
} from 'redux-saga/effects'
import {
  compose,
  converge,
  equals,
  head,
  includes,
  keys,
  last,
  or,
  path,
  pathOr,
  prop,
  propOr
} from 'ramda'

import * as A from './actions'
import * as AT from './actionTypes'
import * as C from 'services/AlertService'
import * as Lockbox from 'services/LockboxService'
import * as S from './selectors'
import { actions, actionTypes, model, selectors } from 'data'
import {
  addBalanceLimit,
  convertBaseToStandard,
  convertSourceFeesToFiat,
  convertSourceToTarget,
  convertStandardToBase,
  divide,
  formatLimits,
  getEffectiveBalanceStandard,
  selectFee,
  validateMinMax,
  validateVolume
} from './services'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { CoinType, PaymentValue } from 'core/types'
import {
  CONFIRM_FORM,
  CONFIRM_MODAL,
  EXCHANGE_FORM,
  getSourceCoinsPairedToTarget,
  getTargetCoinsPairedToSource,
  INSUFFICIENT_ETH_FOR_TX_FEE,
  LATEST_TX_ERROR,
  LATEST_TX_FETCH_FAILED_ERROR,
  MISSING_DEVICE_ERROR,
  NO_ADVICE_ERROR,
  NO_LIMITS_ERROR
} from './model'
import { currencySymbolMap } from 'services/CoinifyService'
import { ETH_AIRDROP_MODAL } from '../exchangeHistory/model'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { promptForLockbox, promptForSecondPassword } from 'services/SagaService'
import { selectReceiveAddress } from '../utils/sagas'
import utils from './sagas.utils'

export const logLocation = 'exchange/sagas'
export const renewLimitsDelay = 30 * 1000
const fallbackSourceFees = { source: 0, target: 0, mempoolFees: {} }

let renewLimitsTask = null
export default ({ api, coreSagas, networks }) => {
  const { SWAP_EVENTS } = model.analytics
  const {
    RESULTS_MODAL,
    formatExchangeTrade
  } = model.components.exchangeHistory

  const {
    mapFixToFieldName,
    configEquals,
    formatPair,
    swapBaseAndCounter,
    getBestRatesPairs,
    MIN_ERROR
  } = model.rates
  const {
    calculatePaymentMemo,
    calculateProvisionalPayment,
    getDefaultAccount,
    createPayment,
    updateLatestEthTrade,
    validateXlm,
    validateXlmCreateAccount,
    validateXlmAccountExists
  } = utils({
    coreSagas,
    networks
  })
  const formValueSelector = selectors.form.getFormValues(EXCHANGE_FORM)
  const formErrorSelector = selectors.form.getFormError(EXCHANGE_FORM)
  const asyncValidatingSelector = selectors.form.isAsyncValidating(
    EXCHANGE_FORM
  )
  const getActiveFieldName = compose(mapFixToFieldName, prop('fix'))
  // @ts-ignore
  const getCurrentVolume = form => propOr(0, getActiveFieldName(form), form)
  const getCurrentPair = converge(formatPair, [
    path(['source', 'coin']),
    path(['target', 'coin'])
  ])

  const getFiatCurrency = function * () {
    return (yield select(selectors.core.settings.getCurrency)).getOrElse(null)
  }

  const getLimits = function * (currency) {
    const limitsR = yield select(S.getLimits)
    if (Remote.Loading.is(limitsR)) {
      return path(
        ['payload', 'limits', currency],
        yield take(AT.FETCH_LIMITS_SUCCESS)
      )
    }
    return limitsR.map(prop(currency)).getOrFail(NO_LIMITS_ERROR)
  }

  const getBestRates = function * () {
    const ratesR = yield select(selectors.modules.rates.getBestRates)
    if (Remote.Loading.is(ratesR) || Remote.NotAsked.is(ratesR)) {
      return path(
        ['payload', 'rates'],
        yield take(actionTypes.modules.rates.UPDATE_BEST_RATES)
      )
    }
    return ratesR.getOrFail(NO_ADVICE_ERROR)
  }

  const getBalanceLimit = function * (fiatCurrency) {
    const form = yield select(formValueSelector)
    const source = prop('source', form)
    const sourceCoin = prop('coin', source)
    const noAccount = prop('noAccount', source)
    if (noAccount) {
      return {
        fiatBalance: {
          amount: 0,
          fiat: true,
          symbol: currencySymbolMap[fiatCurrency]
        },
        cryptoBalance: {
          amount: 0,
          fiat: false,
          symbol: currencySymbolMap[sourceCoin]
        }
      }
    }
    const payment = yield call(getProvisionalPayment)
    const balance = getEffectiveBalanceStandard(
      sourceCoin,
      payment.effectiveBalance
    )
    yield call(updateSourceFee, payment)
    const rates = yield call(getBestRates)
    const rate = path([formatPair(fiatCurrency, sourceCoin), 'price'], rates)
    return {
      fiatBalance: {
        amount: divide(balance, rate, 2),
        fiat: true,
        symbol: currencySymbolMap[fiatCurrency]
      },
      cryptoBalance: {
        amount: balance,
        fiat: false,
        symbol: currencySymbolMap[sourceCoin]
      }
    }
  }

  const getAmounts = function * (pair) {
    const amountsR = yield select(S.getAmounts(pair))

    if (Remote.Loading.is(amountsR) || Remote.NotAsked.is(amountsR)) {
      const quote = yield take(actionTypes.modules.rates.SET_PAIR_QUOTE)
      return compose(
        S.adviceToAmount,
        path(['payload', 'quote', 'currencyRatio'])
      )(quote)
    }

    if (Remote.Failure.is(amountsR)) return S.adviceToAmount(0)

    return amountsR.getOrFail(S.adviceToAmount(0))
  }

  const exchangeFormInitialized = function * ({ payload }) {
    const initialValues = yield select(
      S.getInitialValues,
      payload.requestedValues
    )

    yield put(actions.form.initialize(EXCHANGE_FORM, initialValues))
    yield call(changeSubscription, true)
    yield call(fetchLimits)
    yield call(updateSourceFee)
  }

  const validateForm = function * () {
    const currentError = yield select(formErrorSelector)
    const isAsyncValidating = yield select(asyncValidatingSelector)
    const form = yield select(formValueSelector)
    const source = prop('source', form)
    const target = prop('target', form)
    const sourceCoin = prop('coin', source)
    const targetCoin = prop('coin', target)
    const formVolume = getCurrentVolume(form)
    const fiatCurrency = yield call(getFiatCurrency)
    const pair = formatPair(sourceCoin, targetCoin)
    try {
      if (sourceCoin === 'XLM') yield call(validateXlmAccountExists, source)
      const limits = yield call(getLimits, fiatCurrency)
      yield call(validateMinMax, limits)
      if (!formVolume || formVolume === '0') throw MIN_ERROR
      const amounts = yield call(getAmounts, pair)
      const sourceFiatVolume = prop('sourceFiat', amounts)
      const sourceCryptoVolume = prop('sourceAmount', amounts)
      const targetCryptoVolume = prop('targetAmount', amounts)
      yield call(validateVolume, limits, sourceFiatVolume, sourceCryptoVolume)
      if (sourceCoin === 'XLM')
        yield call(validateXlm, sourceCryptoVolume, source)
      if (targetCoin === 'XLM')
        yield call(validateXlmCreateAccount, targetCryptoVolume, target)
      if (currentError || isAsyncValidating)
        yield put(actions.form.stopAsyncValidation(EXCHANGE_FORM))
    } catch (error) {
      if (currentError !== error)
        yield put(
          actions.form.stopAsyncValidation(EXCHANGE_FORM, {
            _error: error
          })
        )
    }
  }

  const onQuoteChange = function * ({ payload }) {
    const { pair } = payload
    const form = yield select(formValueSelector)
    const fix = prop('fix', form)

    if (!(fix && getCurrentPair(form) === pair)) return

    yield call(validateForm)
  }

  const fetchLimits = function * () {
    try {
      yield call(startValidation)
      yield put(A.fetchLimitsLoading())
      const fiatCurrency = yield call(getFiatCurrency)
      const fiatLimits = yield call(api.fetchLimits, fiatCurrency)
      const limits = formatLimits(fiatLimits)
      const balanceLimit = yield call(getBalanceLimit, fiatCurrency)
      yield put(
        A.fetchLimitsSuccess({
          [fiatCurrency]: addBalanceLimit(balanceLimit, limits)
        })
      )
      if (!renewLimitsTask) {
        renewLimitsTask = yield spawn(renewLimits, renewLimitsDelay)
      }
    } catch (e) {
      yield put(A.fetchLimitsError(e))
      yield put(
        actions.form.stopAsyncValidation(EXCHANGE_FORM, {
          _error: NO_LIMITS_ERROR
        })
      )
    }
  }

  const renewLimits = function * (renewIn) {
    try {
      yield delay(renewIn)
      const fiatCurrency = yield call(getFiatCurrency)
      const fiatLimits = yield call(api.fetchLimits, fiatCurrency)
      const limits = formatLimits(fiatLimits)
      const balanceLimit = yield call(getBalanceLimit, fiatCurrency)
      yield put(
        A.fetchLimitsSuccess({
          [fiatCurrency]: addBalanceLimit(balanceLimit, limits)
        })
      )
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'renewLimits', e))
    } finally {
      yield fork(renewLimits, renewLimitsDelay)
    }
  }

  const getProvisionalPayment = function * (memo = true) {
    const form = yield select(formValueSelector)
    const source = prop('source', form)
    const amounts = yield call(getAmounts, getCurrentPair(form))
    const sourceAmount = prop('sourceAmount', amounts)
    return yield call(
      memo ? calculatePaymentMemo : calculateProvisionalPayment,
      source,
      sourceAmount
    )
  }

  const updateSourceFee = function * (payment?: PaymentValue) {
    try {
      const form = yield select(formValueSelector)
      const sourceCoin = path(['source', 'coin'], form)
      const erc20List = (yield select(
        selectors.core.walletOptions.getErc20CoinList
      )).getOrFail()
      const isSourceErc20 = includes(sourceCoin, erc20List)
      const feeSource = isSourceErc20 ? 'ETH' : (sourceCoin as CoinType)
      const provisionalPayment = yield payment ||
        call(getProvisionalPayment, true)
      const fiatCurrency = yield call(getFiatCurrency)
      const fee = convertBaseToStandard(
        feeSource,
        selectFee(sourceCoin, provisionalPayment)
      )
      const rates = yield call(getBestRates)
      // For ERC20, fallback to eth ticker
      const fallbackEthRates = (yield select(
        selectors.core.data.eth.getRates
      )).getOrElse({})
      const sourceFees = {
        source: fee,
        mempoolFees: provisionalPayment.fees,
        target: convertSourceToTarget(form, rates, fee),
        sourceFiat: convertSourceFeesToFiat(
          form,
          fiatCurrency,
          rates,
          fee,
          isSourceErc20,
          fallbackEthRates
        ),
        isSourceErc20,
        insufficientEthBalance: false
      }
      // ensure for sufficient eth balance for erc20 swap
      if (isSourceErc20) {
        const ethBalanceInWei = (yield select(
          selectors.core.data.eth.getDefaultAddressBalance
        )).getOrElse(0)
        let ethBalance = Exchange.convertEtherToEther({
          value: ethBalanceInWei,
          fromUnit: 'WEI',
          toUnit: 'ETH'
        }).value
        if (fee >= ethBalance) {
          sourceFees.insufficientEthBalance = true
          yield put(A.setTxError(INSUFFICIENT_ETH_FOR_TX_FEE))
        }
      }
      yield put(A.setSourceFee(sourceFees))
    } catch (e) {
      yield put(A.setSourceFee(fallbackSourceFees))
    }
  }

  const checkLatestTx = function * (coin) {
    const erc20List = (yield select(
      selectors.core.walletOptions.getErc20CoinList
    )).getOrFail()
    try {
      yield put(A.setTxError(null))
      if (coin !== 'ETH' && !includes(coin, erc20List)) return
      const provisionalPayment = yield call(getProvisionalPayment, false)
      if (provisionalPayment.unconfirmedTx) throw LATEST_TX_ERROR
    } catch (e) {
      if (e === MIN_ERROR) return
      yield put(
        A.setTxError(
          e === LATEST_TX_ERROR ? LATEST_TX_ERROR : LATEST_TX_FETCH_FAILED_ERROR
        )
      )
    }
  }

  const updateMinMax = function * () {
    try {
      const fiatCurrency = yield call(getFiatCurrency)
      const limits = yield call(getLimits, fiatCurrency)
      const min = prop('minOrder', limits)
      const max = prop('maxPossibleOrder', limits)
      yield put(A.setMinMax(min, max))
    } catch (error) {
      yield put(A.setMinMax(null, null))
      yield put(
        actions.form.stopAsyncValidation(EXCHANGE_FORM, {
          _error: error
        })
      )
    }
  }

  const clearMinMax = function * () {
    yield put(A.setMinMax(null, null))
  }

  const useMin = function * () {
    const { amount, fiat } = yield select(S.getMin)
    yield put(
      actions.form.change(EXCHANGE_FORM, 'fix', fiat ? 'baseInFiat' : 'base')
    )
    yield put(A.changeAmount(amount))
    yield put(actions.analytics.logEvent(SWAP_EVENTS.USE_MIN))
  }

  const useMax = function * () {
    const { amount, fiat } = yield select(S.getMax)
    yield put(
      actions.form.change(EXCHANGE_FORM, 'fix', fiat ? 'baseInFiat' : 'base')
    )
    yield put(A.changeAmount(amount))
    yield put(actions.analytics.logEvent(SWAP_EVENTS.USE_MAX))
  }

  const updateLimits = function * () {
    yield call(fetchLimits)
    yield call(validateForm)
    yield call(updateMinMax)
  }

  const onBestRatesChange = function * () {
    yield call(updateBalanceLimit)
    yield call(validateForm)
    yield call(updateMinMax)
  }

  const updateBalanceLimit = function * () {
    try {
      const fiatCurrency = yield call(getFiatCurrency)
      const limits = yield call(getLimits, fiatCurrency)
      const balanceLimit = yield call(getBalanceLimit, fiatCurrency)
      yield put(
        // @ts-ignore
        A.fetchLimitsSuccess({
          [fiatCurrency]: addBalanceLimit(balanceLimit, limits)
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

  const changeSubscription = function * (pairChanged = false) {
    const form = yield select(formValueSelector)
    const sourceCoin = path(['source', 'coin'], form)
    const targetCoin = path(['target', 'coin'], form)
    if (!sourceCoin || !targetCoin) return

    const fiatCurrency = yield call(getFiatCurrency)
    yield call(
      changeAdviceSubscription,
      getCurrentVolume(form),
      prop('fix', form),
      fiatCurrency,
      getCurrentPair(form),
      pairChanged
    )
    yield call(changeRatesSubscription, sourceCoin, targetCoin, fiatCurrency)
  }

  const changeAdviceSubscription = function * (
    volume,
    fix,
    fiatCurrency,
    pair,
    pairChanged
  ) {
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
      actions.modules.rates.subscribeToAdvice(
        pair,
        or(volume, '0'),
        fix,
        fiatCurrency
      )
    )
  }

  const changeRatesSubscription = function * (
    sourceCoin,
    targetCoin,
    fiatCurrency
  ) {
    const pairs = getBestRatesPairs(sourceCoin, targetCoin, fiatCurrency)
    const currentPairs = (yield select(selectors.modules.rates.getBestRates))
      .map(keys)
      .getOrElse([])

    if (equals(pairs, currentPairs)) return

    yield put(actions.modules.rates.subscribeToRates(pairs))
  }

  const unsubscribeFromCurrentAdvice = function * (form) {
    yield put(actions.modules.rates.unsubscribeFromAdvice(getCurrentPair(form)))
  }

  const startValidation = function * () {
    yield put(actions.form.clearSubmitErrors(EXCHANGE_FORM))
    yield put(actions.form.startAsyncValidation(EXCHANGE_FORM))
  }

  const changeSource = function * ({ payload }) {
    try {
      const form = yield select(formValueSelector)
      const source = prop('source', payload)
      const sourceCoin = prop('coin', source)
      const targetCoin = path(['target', 'coin'], form)
      const prevSourceCoin = path(['source', 'coin'], form)
      yield put(actions.form.change(EXCHANGE_FORM, 'source', source))

      const pairs = (yield select(S.getAvailablePairs)).getOrElse([])
      const pairedCoins = getTargetCoinsPairedToSource(sourceCoin, pairs)
      let newTargetCoin = null
      if (equals(sourceCoin, targetCoin)) {
        // @ts-ignore
        newTargetCoin = includes(prevSourceCoin, pairedCoins)
          ? prevSourceCoin
          : last(pairedCoins)
      }
      // @ts-ignore
      if (!includes(targetCoin, pairedCoins)) newTargetCoin = last(pairedCoins)
      if (newTargetCoin) {
        const newTarget = yield call(getDefaultAccount, newTargetCoin)
        yield put(actions.form.change(EXCHANGE_FORM, 'target', newTarget))
      }

      yield call(startValidation)
      yield call(clearMinMax)
      yield call(unsubscribeFromCurrentAdvice, form)
      yield call(changeSubscription, true)
      yield call(checkLatestTx, sourceCoin)
      yield call(updateSourceFee)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'changeSource', e))
    }
  }

  const changeTarget = function * ({ payload }) {
    try {
      const form = yield select(formValueSelector)
      const sourceCoin = path(['source', 'coin'], form)
      const target = prop('target', payload)
      const targetCoin = prop('coin', target)
      const prevTargetCoin = path(['target', 'coin'], form)
      yield put(actions.form.change(EXCHANGE_FORM, 'target', target))

      const pairs = (yield select(S.getAvailablePairs)).getOrElse([])
      const pairedCoins = getSourceCoinsPairedToTarget(targetCoin, pairs)
      let newSourceCoin = null
      if (equals(sourceCoin, targetCoin)) {
        // @ts-ignore
        newSourceCoin = includes(prevTargetCoin, pairedCoins)
          ? prevTargetCoin
          : head(pairedCoins)
      }
      // @ts-ignore
      if (!includes(sourceCoin, pairedCoins)) newSourceCoin = head(pairedCoins)
      if (newSourceCoin) {
        const newSource = yield call(getDefaultAccount, newSourceCoin)
        yield put(actions.form.change(EXCHANGE_FORM, 'source', newSource))
      }

      yield call(startValidation)
      yield call(unsubscribeFromCurrentAdvice, form)
      yield call(changeSubscription, true)
      yield call(checkLatestTx, newSourceCoin || sourceCoin)
      yield call(updateSourceFee)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'changeTarget', e))
    }
  }

  const changeAmount = function * ({ payload }) {
    try {
      const { amount } = payload
      const form = yield select(formValueSelector)

      yield call(startValidation)
      yield put(
        // @ts-ignore
        actions.form.change(EXCHANGE_FORM, getActiveFieldName(form), amount)
      )
      yield put(A.setShowError(true))
      yield call(changeSubscription)
      yield call(updateSourceFee)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'changeAmount', e))
    }
  }

  const changeFix = function * ({ payload }) {
    try {
      const form = yield select(formValueSelector)
      const { fix } = payload
      const pair = getCurrentPair(form)
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
      yield call(checkLatestTx, path(['source', 'coin'], form))
      yield call(updateMinMax)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'changeFix', e))
    }
  }

  const swapFieldValue = function * () {
    try {
      const form = yield select(formValueSelector)
      const fix = prop('fix', form)
      const source = prop('source', form)
      const target = prop('target', form)
      const pair = getCurrentPair(form)
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
      yield call(checkLatestTx, prop('source', target))
      yield call(clearMinMax)
      yield call(updateSourceFee)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'swapFieldValue', e))
    }
  }

  const showConfirmation = function * () {
    const form = yield select(formValueSelector)
    yield call(checkLatestTx, path(['source', 'coin'], form))
    const txError = yield select(S.getTxError)

    if (txError) {
      yield put(actions.analytics.logEvent(SWAP_EVENTS.ORDER_PREVIEW_ERROR))
    } else {
      yield put(
        actions.modals.showModal(CONFIRM_MODAL, { origin: 'ExchangeForm' })
      )
    }
  }

  // Ask for second password or lockbox transport
  const getDepositCredentials = function * (source) {
    if (source.type !== ADDRESS_TYPES.LOCKBOX) {
      const password = yield call(promptForSecondPassword)
      return { password }
    }
    const deviceR = yield select(
      selectors.core.kvStore.lockbox.getDeviceFromCoinAddrs,
      prop('coin', source),
      [prop('address', source)]
    )
    const device = deviceR.getOrFail(MISSING_DEVICE_ERROR)
    const coin = prop('coin', source)
    const deviceType = prop('device_type', device)
    yield call(promptForLockbox, coin, deviceType)
    const scrambleKey = Lockbox.utils.getScrambleKey(coin, deviceType)
    const connection = yield select(
      selectors.components.lockbox.getCurrentConnection
    )
    return { scrambleKey, connection }
  }

  const createTrade = function * (source, target, pair) {
    const quote = (yield select(
      selectors.modules.rates.getPairQuote(pair)
    )).getOrFail(NO_ADVICE_ERROR)
    const refundAddress = yield call(selectReceiveAddress, source, networks)
    const destinationAddress = yield call(
      selectReceiveAddress,
      target,
      networks
    )
    // Execute trade
    return yield call(
      api.executeTrade,
      quote,
      refundAddress,
      destinationAddress
    )
  }

  const depositFunds = function * (trade, source, fees, depositCredentials) {
    let txId = null
    const sourceCoin = prop('coin', source)
    try {
      const {
        depositAddress,
        depositMemo,
        deposit: { symbol, value }
      } = trade
      const erc20List = (yield select(
        selectors.core.walletOptions.getErc20CoinList
      )).getOrFail()
      let payment = yield call(
        createPayment,
        symbol,
        source.address,
        depositAddress,
        source.type,
        convertStandardToBase(symbol, value),
        fees,
        depositMemo
      )
      // Sign transaction
      if (source.type !== ADDRESS_TYPES.LOCKBOX) {
        const { password } = depositCredentials
        payment = yield payment.sign(password)
        payment = yield payment.publish()
        txId = payment.value().txId
      } else {
        const { connection, scrambleKey } = depositCredentials
        payment = yield payment.sign(
          null,
          prop('transport', connection),
          scrambleKey
        )
        payment = yield payment.publish()
        txId = payment.value().txId
        yield put(actions.components.lockbox.setConnectionSuccess())
        yield delay(4000)
        yield put(actions.modals.closeAllModals())
      }

      if (sourceCoin === 'ETH' || includes(sourceCoin, erc20List)) {
        yield call(updateLatestEthTrade, txId, source.type)
      }
    } catch (err) {
      if (sourceCoin === 'XLM') {
        const xlmErrMessage = pathOr(
          err,
          ['response', 'data', 'extras', 'result_codes'],
          err
        )
        yield call(api.failTrade, trade.id, xlmErrMessage, txId)
      } else {
        yield call(api.failTrade, trade.id, err, txId)
      }
      throw err
    }
  }

  const showConfirmationError = function * (err) {
    yield put(actions.form.stopSubmit(CONFIRM_FORM, { _error: err }))
    yield put(
      actions.logs.logErrorMessage(logLocation, 'confirm', JSON.stringify(err))
    )
  }

  const confirm = function * () {
    // Get form data
    yield put(actions.form.clearSubmitErrors(CONFIRM_FORM))
    yield put(actions.form.startSubmit(CONFIRM_FORM))
    const form = yield select(formValueSelector)
    const source = prop('source', form)
    const target = prop('target', form)
    const pair = getCurrentPair(form)
    const fees = yield select(S.getMempoolFees)
    const isPowerPaxTagged = (yield select(
      selectors.modules.profile.getPowerPaxTag
    )).getOrElse(true)
    const userTier = (yield select(
      selectors.modules.profile.getUserTiers
    )).getOrElse({ current: 1 })
    try {
      const depositCredentials = yield call(getDepositCredentials, source)
      const trade = yield call(createTrade, source, target, pair)
      yield call(depositFunds, trade, source, fees, depositCredentials)
      yield put(actions.form.stopSubmit(CONFIRM_FORM))
      yield put(actions.router.push('/swap/history'))
      yield take(actionTypes.modals.CLOSE_ALL_MODALS)
      // Check for eth airdrop eligibility
      if (!isPowerPaxTagged && equals('PAX', target.coin)) {
        if (equals(2, userTier.current)) {
          yield put(
            actions.modals.showModal(ETH_AIRDROP_MODAL, {
              tradeData: formatExchangeTrade(trade),
              origin: 'ExchangeForm'
            })
          )
        } else {
          yield put(
            actions.alerts.displaySuccess(C.FIRST_PAX_TRADE_INFO, null, true)
          )
          yield put(
            // @ts-ignore
            actions.modals.showModal(RESULTS_MODAL, formatExchangeTrade(trade))
          )
        }
      } else {
        yield put(
          // @ts-ignore
          actions.modals.showModal(RESULTS_MODAL, formatExchangeTrade(trade))
        )
      }
      yield put(actions.components.refresh.refreshClicked())
      yield put(actions.modules.profile.fetchUser())
    } catch (err) {
      return yield call(showConfirmationError, err)
    }
  }

  const clearSubscriptions = function * () {
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
      yield put(A.setSourceFee(fallbackSourceFees))
      yield put(actions.modules.rates.unsubscribeFromRates())
      // @ts-ignore
      if (renewLimitsTask) yield cancel(renewLimitsTask)
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
    checkLatestTx,
    useMin,
    useMax,
    changeFix,
    confirm,
    clearSubscriptions,
    swapFieldValue,
    updateLimits,
    onBestRatesChange,
    onQuoteChange,
    showConfirmation,
    validateForm
  }
}
