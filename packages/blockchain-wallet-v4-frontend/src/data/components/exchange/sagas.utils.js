import { call, cancel, fork, join, put, select } from 'redux-saga/effects'
import { equals, identity, head, path, pathOr, prop, toLower } from 'ramda'
import { selectors, actions } from 'data'
import * as S from './selectors'
import settings from 'config'
import {
  getPairFromCoin,
  convertFiatToCoin,
  convertCoinToFiat,
  convertStandardToBase,
  isUndefinedOrEqualsToZero
} from './services'
import { selectRates } from '../utils/sagas'
import { SHAPESHIFT_FORM } from './model'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'

const PROVISIONAL_BTC_SCRIPT = '00000000000000000000000'
const PROVISIONAL_BCH_SCRIPT = '0000000000000000000000000'
export default ({ api, coreSagas, networks, options }) => {
  const logLocation = 'components/exchange/sagas.utils'

  let prevPaymentSource
  let prevPaymentAmount
  let prevPayment
  let paymentTask
  const calculatePaymentMemo = function*(source, amount) {
    if (
      !equals(source, prevPaymentSource) ||
      !equals(amount, prevPaymentAmount)
    ) {
      if (paymentTask) cancel(paymentTask)
      paymentTask = yield fork(calculateProvisionalPayment, source, amount)
      prevPayment = yield join(paymentTask)
      prevPaymentSource = source
      prevPaymentAmount = amount
      paymentTask = null
    }
    return prevPayment
  }

  const btcOptions = [settings.NETWORK_BTC, PROVISIONAL_BTC_SCRIPT]
  const bchOptions = [settings.NETWORK_BCH, PROVISIONAL_BCH_SCRIPT]
  const ethOptions = [settings.NETWORK_ETH, null]
  const calculateProvisionalPayment = function*(source, amount) {
    try {
      const coin = prop('coin', source)
      const addressOrIndex = prop('address', source)
      const [network, provisionalScript] = prop(coin, {
        BTC: btcOptions,
        BCH: bchOptions,
        ETH: ethOptions
      })
      const payment = yield coreSagas.payment[toLower(coin)]
        .create({ network })
        .chain()
        .init()
        .fee('priority')
        .from(addressOrIndex, ADDRESS_TYPES.ACCOUNT)
        .done()
      if (coin === 'ETH') return payment.value()

      return (yield payment
        .chain()
        .to(provisionalScript, ADDRESS_TYPES.SCRIPT)
        .amount(parseInt(convertStandardToBase(coin, amount)))
        .build()
        .done()).value()
    } catch (e) {
      return {}
    }
  }

  let prevBalanceSource
  let prevBalance
  let balanceTask
  const calculateEffectiveBalanceMemo = function*(source) {
    if (!equals(source, prevBalanceSource)) {
      if (balanceTask) cancel(balanceTask)
      balanceTask = yield fork(calculateEffectiveBalance, source)
      prevBalance = yield join(balanceTask)
      prevBalanceSource = source
      balanceTask = null
    }
    return prevBalance
  }

  const calculateEffectiveBalance = function*(source) {
    const coin = prop('coin', source)
    const addressOrIndex = prop('address', source)
    let payment
    switch (coin) {
      case 'BCH':
        payment = yield coreSagas.payment.bch
          .create({ network: settings.NETWORK_BCH })
          .chain()
          .init()
          .fee('priority')
          .from(addressOrIndex, ADDRESS_TYPES.ACCOUNT)
          .done()
        break
      case 'BTC':
        payment = yield coreSagas.payment.btc
          .create({ network: networks.btc })
          .chain()
          .init()
          .fee('priority')
          .from(addressOrIndex, ADDRESS_TYPES.ACCOUNT)
          .done()
        break
      case 'ETH':
        payment = yield coreSagas.payment.eth
          .create({ network: settings.NETWORK_ETH })
          .chain()
          .init()
          .fee('priority')
          .from(addressOrIndex, ADDRESS_TYPES.ACCOUNT)
          .done()
        break
      default:
        yield put(
          actions.logs.logErrorMessage(
            logLocation,
            'calculateEffectiveBalance',
            'Could not get effective balance.'
          )
        )
        throw new Error('Could not get effective balance.')
    }
    return prop('effectiveBalance', payment.value())
  }

  const createPayment = function*(
    coin,
    sourceAddressOrIndex,
    targetAddress,
    amount
  ) {
    let payment
    switch (coin) {
      case 'BCH':
        payment = coreSagas.payment.bch
          .create({ network: settings.NETWORK_BCH })
          .chain()
          .init()
          .fee('priority')
          .amount(parseInt(amount))
        break
      case 'BTC':
        payment = coreSagas.payment.btc
          .create({ network: networks.btc })
          .chain()
          .init()
          .fee('priority')
          .amount(parseInt(amount))
        break
      case 'ETH':
        payment = coreSagas.payment.eth
          .create({ network: settings.NETWORK_ETH })
          .chain()
          .init()
          .fee('priority')
          .amount(amount)
        break
      default:
        yield put(
          actions.logs.logErrorMessage(
            logLocation,
            'createPayment',
            'Could not create payment.'
          )
        )
        throw new Error('Could not create payment.')
    }
    payment = yield payment
      .from(sourceAddressOrIndex, ADDRESS_TYPES.ACCOUNT)
      .to(targetAddress, ADDRESS_TYPES.ADDRESS)
      .build()
      .done()
    yield put(
      actions.logs.logInfoMessage(logLocation, 'createPayment', payment)
    )
    return payment
  }

  const resumePayment = function (coin, payment) {
    switch (coin) {
      case 'BCH':
        return coreSagas.payment.bch.create({
          payment,
          network: settings.NETWORK_BCH
        })
      case 'BTC':
        return coreSagas.payment.btc.create({
          payment,
          network: networks.btc
        })
      case 'ETH':
        return coreSagas.payment.eth.create({
          payment,
          network: settings.NETWORK_ETH
        })
      default:
        throw new Error('Could not resume payment.')
    }
  }

  const getShapeshiftMinimum = function*(source, target) {
    const coinSource = prop('coin', source)
    const coinTarget = prop('coin', target)
    const pair = getPairFromCoin(coinSource, coinTarget)
    const shapeshiftPairR = yield select(
      selectors.core.data.shapeShift.getPair(pair)
    )
    const shapeshiftPair = shapeshiftPairR.getOrFail(
      'Could not find shapeshift pair.'
    )
    const minimumStandard = prop('minimum', shapeshiftPair)
    return convertStandardToBase(coinSource, minimumStandard)
  }

  const getShapeshiftMaximum = function*(source, target) {
    const coinSource = prop('coin', source)
    const coinTarget = prop('coin', target)
    const pair = getPairFromCoin(coinSource, coinTarget)
    const shapeshiftPairR = yield select(
      selectors.core.data.shapeShift.getPair(pair)
    )
    const shapeshiftPair = shapeshiftPairR.getOrFail(
      'Could not find shapeshift pair.'
    )
    const maximumStandard = prop('limit', shapeshiftPair)
    return convertStandardToBase(coinSource, maximumStandard)
  }

  const getRegulationLimit = function*(source) {
    const sourceCoin = prop('coin', source)
    const sourceRates = yield call(selectRates, sourceCoin)
    const upperLimit =
      path(
        ['platforms', 'web', 'shapeshift', 'config', 'upperLimit'],
        options
      ) || 750
    switch (sourceCoin) {
      case 'BCH':
        return convertFiatToCoin(upperLimit, 'USD', 'BCH', 'SAT', sourceRates)
          .value
      case 'BTC':
        return convertFiatToCoin(upperLimit, 'USD', 'BTC', 'SAT', sourceRates)
          .value
      case 'ETH':
        return convertFiatToCoin(upperLimit, 'USD', 'ETH', 'WEI', sourceRates)
          .value
      default:
        throw new Error('getRegulationLimit: coin not found.')
    }
  }

  const convertValues = function*(type) {
    const currencyR = yield select(selectors.core.settings.getCurrency)
    const currency = currencyR.getOrElse('USD')
    const form = yield select(selectors.form.getFormValues(SHAPESHIFT_FORM))
    const sourceCoin = path(['source', 'coin'], form)
    const targetCoin = path(['target', 'coin'], form)
    const sourceRates = yield call(selectRates, sourceCoin)
    const targetRates = yield call(selectRates, targetCoin)
    const pair = getPairFromCoin(sourceCoin, targetCoin)
    const defaultResult = {
      sourceAmount: 0,
      sourceFiat: 0,
      targetAmount: 0,
      targetFiat: 0
    }

    switch (type) {
      case 'sourceFiat': {
        const sourceFiat = prop('sourceFiat', form)
        if (isUndefinedOrEqualsToZero(sourceFiat)) return defaultResult
        const sourceAmount = convertFiatToCoin(
          sourceFiat,
          currency,
          sourceCoin,
          sourceCoin,
          sourceRates
        ).value
        const quotation = yield call(api.createQuote, sourceAmount, pair, true)
        const targetAmount = pathOr(
          0,
          ['success', 'withdrawalAmount'],
          quotation
        )
        const targetFiat = convertCoinToFiat(
          targetAmount,
          targetCoin,
          targetCoin,
          currency,
          targetRates
        ).value
        return { sourceAmount, sourceFiat, targetAmount, targetFiat }
      }
      case 'targetAmount': {
        const targetAmount = prop('targetAmount', form)
        if (isUndefinedOrEqualsToZero(targetAmount)) return defaultResult
        const quotation = yield call(api.createQuote, targetAmount, pair, false)
        const sourceAmount = pathOr(0, ['success', 'depositAmount'], quotation)
        const sourceFiat = convertCoinToFiat(
          sourceAmount,
          sourceCoin,
          sourceCoin,
          currency,
          sourceRates
        ).value
        const targetFiat = convertCoinToFiat(
          targetAmount,
          targetCoin,
          targetCoin,
          currency,
          targetRates
        ).value
        return { sourceAmount, sourceFiat, targetAmount, targetFiat }
      }
      case 'targetFiat': {
        const targetFiat = prop('targetFiat', form)
        if (isUndefinedOrEqualsToZero(targetFiat)) return defaultResult
        const targetAmount = convertFiatToCoin(
          targetFiat,
          currency,
          targetCoin,
          targetCoin,
          targetRates
        ).value
        const quotation = yield call(api.createQuote, targetAmount, pair, false)
        const sourceAmount = pathOr(0, ['success', 'depositAmount'], quotation)
        const sourceFiat = convertCoinToFiat(
          sourceAmount,
          sourceCoin,
          sourceCoin,
          currency,
          sourceRates
        ).value
        return { sourceAmount, sourceFiat, targetAmount, targetFiat }
      }
      case 'sourceAmount':
      default: {
        const sourceAmount = prop('sourceAmount', form)
        if (isUndefinedOrEqualsToZero(sourceAmount)) return defaultResult
        const quotation = yield call(api.createQuote, sourceAmount, pair, true)
        const targetAmount = pathOr(
          0,
          ['success', 'withdrawalAmount'],
          quotation
        )
        const sourceFiat = convertCoinToFiat(
          sourceAmount,
          sourceCoin,
          sourceCoin,
          currency,
          sourceRates
        ).value
        const targetFiat = convertCoinToFiat(
          targetAmount,
          targetCoin,
          targetCoin,
          currency,
          targetRates
        ).value
        return { sourceAmount, sourceFiat, targetAmount, targetFiat }
      }
    }
  }

  const getDefaultBchAccountValue = function*() {
    const bchAccounts = yield select(S.getActiveBchAccounts)
    return head(bchAccounts.getOrFail('Could not get BCH HD accounts.'))
  }

  const getDefaultBtcAccountValue = function*() {
    const btcAccounts = yield select(S.getActiveBtcAccounts)
    return head(btcAccounts.getOrFail('Could not get BTC HD accounts.'))
  }

  const getDefaultEthAccountValue = function*() {
    const ethAccounts = yield select(S.getActiveEthAccounts)
    return head(ethAccounts.getOrFail('Could not get ETH accounts.'))
  }

  const selectOtherAccount = function*(coin) {
    if (equals('BTC', coin)) {
      return yield call(getDefaultEthAccountValue)
    } else {
      return yield call(getDefaultBtcAccountValue)
    }
  }

  const getDefaultAccount = function*(coin) {
    switch (coin) {
      case 'BCH':
        return yield call(getDefaultBchAccountValue)
      case 'BTC':
        return yield call(getDefaultBtcAccountValue)
      case 'ETH':
        return yield call(getDefaultEthAccountValue)
      default:
        return yield call(getDefaultBtcAccountValue)
    }
  }

  const selectLabel = function*(coin, value) {
    const appState = yield select(identity)
    switch (coin) {
      case 'BTC':
        return (
          selectors.core.wallet.getAccountLabel(appState)(value) ||
          selectors.core.wallet.getLegacyAddressLabel(appState)(value)
        )
      case 'BCH':
        return selectors.core.kvStore.bch
          .getAccountLabel(appState)(value)
          .getOrElse(value)
      case 'ETH':
        return selectors.core.kvStore.ethereum
          .getAccountLabel(appState, value)
          .getOrElse(value)
      default:
        return value
    }
  }

  const resetForm = function*() {
    yield put(actions.form.change2(SHAPESHIFT_FORM, 'sourceAmount', ''))
    yield put(actions.form.change2(SHAPESHIFT_FORM, 'sourceFiat', ''))
    yield put(actions.form.change2(SHAPESHIFT_FORM, 'targetAmount', ''))
    yield put(actions.form.change2(SHAPESHIFT_FORM, 'targetFiat', ''))
    yield put(actions.components.exchange.firstStepFormUnvalidated('initial'))
  }

  return {
    calculatePaymentMemo,
    calculateEffectiveBalanceMemo,
    calculateEffectiveBalance,
    createPayment,
    resumePayment,
    getDefaultAccount,
    getShapeshiftMinimum,
    getShapeshiftMaximum,
    getRegulationLimit,
    convertValues,
    selectLabel,
    selectOtherAccount,
    resetForm
  }
}
