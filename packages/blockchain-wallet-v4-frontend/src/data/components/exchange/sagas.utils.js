import { call, cancel, fork, join, put, select } from 'redux-saga/effects'
import { always, contains, equals, head, prop, toLower } from 'ramda'
import BigNumber from 'bignumber.js'

import { selectors, actions } from 'data'
import * as S from './selectors'
import { convertStandardToBase } from './services'
import { CREATE_ACCOUNT_ERROR, NO_ACCOUNT_ERROR, RESERVE_ERROR } from './model'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { Exchange } from 'blockchain-wallet-v4'

const PROVISIONAL_BTC_SCRIPT = '00000000000000000000000'
const PROVISIONAL_BCH_SCRIPT = '0000000000000000000000000'
const PROVISIONAL_BSV_SCRIPT = '0000000000000000000000000'
export default ({ coreSagas, networks }) => {
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
  const btcOptions = [networks.btc, PROVISIONAL_BTC_SCRIPT]
  const bchOptions = [networks.bch, PROVISIONAL_BCH_SCRIPT]
  const bsvOptions = [networks.bsv, PROVISIONAL_BSV_SCRIPT]
  const ethOptions = [networks.eth, null]
  const xlmOptions = [null, null]
  const calculateProvisionalPayment = function*(source, amount) {
    try {
      const coin = prop('coin', source)
      const addressOrIndex = prop('address', source)
      const addressType = prop('type', source)
      const [network, provisionalScript] = prop(coin, {
        BTC: btcOptions,
        BCH: bchOptions,
        BSV: bsvOptions,
        ETH: ethOptions,
        XLM: xlmOptions
      })
      const payment = yield coreSagas.payment[toLower(coin)]
        .create({ network })
        .chain()
        .init()
        .fee('priority')
        .from(addressOrIndex, addressType)
        .done()
      if (contains(coin, ['ETH', 'XLM'])) return payment.value()

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
    const addressType = prop('type', source)
    let payment

    switch (coin) {
      case 'BCH':
        payment = yield coreSagas.payment.bch
          .create({ network: networks.bch })
          .chain()
          .init()
          .fee('priority')
          .from(addressOrIndex, addressType)
          .done()
        break
      case 'BSV':
        payment = yield coreSagas.payment.bsv
          .create({ network: networks.bsv })
          .chain()
          .init()
          .fee('priority')
          .from(addressOrIndex, addressType)
          .done()
        break
      case 'BTC':
        payment = yield coreSagas.payment.btc
          .create({ network: networks.btc })
          .chain()
          .init()
          .fee('priority')
          .from(addressOrIndex, addressType)
          .done()
        break
      case 'ETH':
        payment = yield coreSagas.payment.eth
          .create({ network: networks.eth })
          .chain()
          .init()
          .fee('priority')
          .from(addressOrIndex, addressType)
          .done()
        break
      case 'XLM':
        payment = yield coreSagas.payment.xlm
          .create({})
          .chain()
          .init()
          .from(addressOrIndex, addressType)
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
    addressType,
    amount,
    memo
  ) {
    let payment
    switch (coin) {
      case 'BCH':
        payment = coreSagas.payment.bch
          .create({ network: networks.bch })
          .chain()
          .init()
          .fee('priority')
          .amount(parseInt(amount))
        break
      case 'BSV':
        payment = coreSagas.payment.bsv
          .create({ network: networks.bsv })
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
          .create({ network: networks.eth })
          .chain()
          .init()
          .fee('priority')
          .amount(amount)
        break
      case 'XLM':
        payment = coreSagas.payment.xlm
          .create()
          .chain()
          .init()
          .from(sourceAddressOrIndex, addressType)
          .memoType('text')
          .memo(memo)
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
      .from(sourceAddressOrIndex, addressType)
      .to(targetAddress, ADDRESS_TYPES.ADDRESS)
      .build()
      .done()
    yield put(
      actions.logs.logInfoMessage(logLocation, 'createPayment', payment)
    )
    return payment
  }

  const getDefaultBchAccountValue = function*() {
    const bchAccounts = yield select(S.getActiveBchAccounts)
    return head(bchAccounts.getOrFail('Could not get BCH HD accounts.'))
  }

  const getDefaultBsvAccountValue = function*() {
    const bsvAccounts = yield select(S.getActiveBsvAccounts)
    return head(bsvAccounts.getOrFail('Could not get BSV HD accounts.'))
  }

  const getDefaultBtcAccountValue = function*() {
    const btcAccounts = yield select(S.getActiveBtcAccounts)
    return head(btcAccounts.getOrFail('Could not get BTC HD accounts.'))
  }

  const getDefaultEthAccountValue = function*() {
    const ethAccounts = yield select(S.getActiveEthAccounts)
    return head(ethAccounts.getOrFail('Could not get ETH accounts.'))
  }

  const getDefaultXlmAccountValue = function*() {
    const xlmAccounts = yield select(S.getActiveXlmAccounts)
    return head(xlmAccounts.getOrFail('Could not get XLM accounts.'))
  }

  const getDefaultAccount = function*(coin) {
    switch (coin) {
      case 'BCH':
        return yield call(getDefaultBchAccountValue)
      case 'BSV':
        return yield call(getDefaultBsvAccountValue)
      case 'BTC':
        return yield call(getDefaultBtcAccountValue)
      case 'ETH':
        return yield call(getDefaultEthAccountValue)
      case 'XLM':
        return yield call(getDefaultXlmAccountValue)
      default:
        return yield call(getDefaultBtcAccountValue)
    }
  }

  const validateXlm = function*(volume, account) {
    try {
      const paymentValue = yield call(calculatePaymentMemo, account, 0)
      const payment = yield call(coreSagas.payment.xlm.create, {
        payment: paymentValue
      })
      payment.amount(volume)
    } catch (e) {
      if (e.message === 'Account does not exist') throw NO_ACCOUNT_ERROR
      if (e.message === 'Reserve exceeds remaining funds') throw RESERVE_ERROR
    }
  }

  const validateXlmAccountExists = account => {
    if (account.noAccount) throw NO_ACCOUNT_ERROR
  }

  const validateXlmCreateAccount = function*(volume, account) {
    const accountId = prop('address', account)
    const accountExists = (yield select(
      selectors.core.data.xlm.getAccount(accountId)
    ))
      .map(always(true))
      .getOrElse(false)
    if (accountExists) return

    const baseReserve = (yield select(
      selectors.core.data.xlm.getBaseReserve
    )).getOrElse('5000000')
    const volumeStroops = Exchange.convertCoinToCoin({
      value: volume,
      coin: 'XLM',
      baseToStandard: false
    }).value
    if (new BigNumber(baseReserve).multipliedBy(2).isGreaterThan(volumeStroops))
      throw CREATE_ACCOUNT_ERROR
  }

  return {
    calculatePaymentMemo,
    calculateProvisionalPayment,
    calculateEffectiveBalanceMemo,
    createPayment,
    getDefaultAccount,
    validateXlm,
    validateXlmAccountExists,
    validateXlmCreateAccount
  }
}
