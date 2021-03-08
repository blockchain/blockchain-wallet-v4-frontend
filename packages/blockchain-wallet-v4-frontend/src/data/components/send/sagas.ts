import { INVALID_COIN_TYPE } from 'blockchain-wallet-v4/src/model'
import { APIType } from 'blockchain-wallet-v4/src/network/api'
import {
  BeneficiaryType,
  CoinType,
  PaymentType,
  PaymentValue,
  RemoteDataType,
  SBOrderType,
  SBPaymentTypes,
  WalletFiatType
} from 'blockchain-wallet-v4/src/types'
import moment from 'moment'
import { call, CallEffect, put, select } from 'redux-saga/effects'

import { actions, model, selectors } from 'data'
import * as C from 'services/alerts'
import { promptForSecondPassword } from 'services/sagas'
import profileSagas from '../../modules/profile/sagas'
import * as A from './actions'

const { BAD_2FA } = model.profile.ERROR_TYPES
const { WITHDRAW_LOCK_DEFAULT_DAYS } = model.profile

export default ({
  api,
  coreSagas,
  networks
}: {
  api: APIType
  coreSagas: any
  networks: any
}) => {
  const logLocation = 'components/send/sagas'
  const { waitForUserData } = profileSagas({ api, coreSagas, networks })

  const buildAndPublishPayment = function * (
    coin: CoinType,
    payment: PaymentType,
    destination: string
  ): Generator<PaymentType | CallEffect, PaymentValue, any> {
    try {
      if (coin === 'XLM') {
        // separate out addresses and memo
        const depositAddressMemo = destination.split(':')
        payment = yield payment.to(depositAddressMemo[0], 'CUSTODIAL')
        // @ts-ignore
        payment = yield payment.memo(depositAddressMemo[1])
        // @ts-ignore
        payment = yield payment.memoType('text')
        // @ts-ignore
        payment = yield payment.setDestinationAccountExists(true)
      } else {
        payment = yield payment.to(destination, 'CUSTODIAL')
      }
      payment = yield payment.build()
      // ask for second password
      const password = yield call(promptForSecondPassword)
      payment = yield payment.sign(password)
      payment = yield payment.publish()
    } catch (e) {
      throw e
    }

    return payment.value()
  }

  const fetchPaymentsAccountExchange = function * (action) {
    const { currency } = action.payload
    try {
      yield call(fetchPaymentsTradingAccount, { payload: { currency } })
      yield call(waitForUserData)
      const isExchangeAccountLinked = (yield select(
        selectors.modules.profile.isExchangeAccountLinked
      )).getOrElse(false)
      if (!isExchangeAccountLinked)
        throw new Error('Wallet is not linked to Exchange')
      yield put(A.fetchPaymentsAccountExchangeLoading(currency))
      const data = yield call(api.getPaymentsAccountExchange, currency)
      yield put(A.fetchPaymentsAccountExchangeSuccess(currency, data))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'fetchPaymentsAccountExchange',
          e
        )
      )
      if (e.type === BAD_2FA) {
        yield put(
          A.fetchPaymentsAccountExchangeSuccess(currency, { address: e.type })
        )
      } else {
        yield put(A.fetchPaymentsAccountExchangeFailure(currency, e))
      }
    }
  }

  const fetchPaymentsTradingAccount = function * (action) {
    const { currency } = action.payload
    try {
      yield put(A.fetchPaymentsTradingAccountLoading(currency))
      const tradingAccount: BeneficiaryType = yield call(
        api.getSBPaymentAccount,
        currency
      )
      yield put(A.fetchPaymentsTradingAccountSuccess(currency, tradingAccount))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'fetchPaymentsTradingAccount',
          e
        )
      )
      yield put(A.fetchPaymentsTradingAccountFailure(currency, e))
    }
  }

  const notifyNonCustodialToCustodialTransfer = function * (
    action: ReturnType<typeof A.notifyNonCustodialToCustodialTransfer>
  ) {
    const { payload } = action
    const { payment, product } = payload
    let address

    if (!payment.to) return
    if (!payment.amount) return
    if (!payment.txId) return
    if (payment.fromType === 'CUSTODIAL') return

    const amount =
      typeof payment.amount === 'string'
        ? payment.amount
        : payment.amount[0].toString()

    if (payment.coin === 'BTC' || payment.coin === 'BCH') {
      address = payment.to[0].address
    } else {
      // @ts-ignore
      address = payment.to.address
    }

    yield call(
      api.notifyNonCustodialToCustodialTransfer,
      payment.coin,
      address,
      payment.txId,
      amount,
      product
    )
  }

  const getWithdrawalLockCheck = function * () {
    try {
      yield put(A.getLockRuleLoading())
      const payment: SBOrderType = yield select(
        selectors.components.simpleBuy.getSBOrder
      )

      const fiatCurrency: WalletFiatType = yield select(
        selectors.components.simpleBuy.getFiatCurrency
      )
      const state = yield select()
      const settingsCurrency: WalletFiatType = selectors.core.settings
        .getCurrency(state)
        .getOrElse('USD')

      const currency = fiatCurrency || settingsCurrency

      // Lock rule can only be called with BANK_TRANSFER and PAYMENT_CARD
      // Adding check here to only pass those too, else pass BANK_TRANSFER
      const withdrawalCheckPayment: SBPaymentTypes =
        payment.paymentType === 'BANK_TRANSFER' ||
        payment.paymentType === 'PAYMENT_CARD'
          ? payment.paymentType
          : 'BANK_TRANSFER'

      const withdrawalLockCheckResponse = yield call(
        api.checkWithdrawalLocks,
        withdrawalCheckPayment,
        currency
      )
      yield put(A.getLockRuleSuccess(withdrawalLockCheckResponse))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'getWithdrawalLockCheck', e)
      )
      yield put(A.getLockRuleFailure(e))
    }
  }

  const showWithdrawalLockAlert = function * () {
    try {
      yield call(getWithdrawalLockCheck)
      const rule =
        (yield select(
          selectors.components.send.getWithdrawLockCheckRule
        )).getOrElse(WITHDRAW_LOCK_DEFAULT_DAYS) || WITHDRAW_LOCK_DEFAULT_DAYS
      const days =
        typeof rule === 'object'
          ? moment.duration(rule.lockTime, 'seconds').days()
          : rule
      yield put(
        actions.alerts.displayError(C.LOCKED_WITHDRAW_ERROR, {
          days: days
        })
      )
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'showWithdrawalLockAlert', e)
      )
    }
  }

  const paymentGetOrElse = (
    coin: CoinType,
    paymentR: RemoteDataType<string | Error, PaymentValue | undefined>
  ): PaymentType => {
    switch (coin) {
      case 'BCH':
        return coreSagas.payment.bch.create({
          payment: paymentR.getOrElse(<PaymentValue>{}),
          network: networks.bch
        })
      case 'BTC':
        return coreSagas.payment.btc.create({
          payment: paymentR.getOrElse(<PaymentValue>{}),
          network: networks.btc
        })
      case 'ETH':
      case 'PAX':
      case 'USDT':
      case 'WDGLD':
        return coreSagas.payment.eth.create({
          payment: paymentR.getOrElse(<PaymentValue>{}),
          network: networks.eth
        })
      case 'XLM':
        return coreSagas.payment.xlm.create({
          payment: paymentR.getOrElse(<PaymentValue>{})
        })
      case 'ALGO':
        // @ts-ignore
        return {}
      default:
        throw new Error(INVALID_COIN_TYPE)
    }
  }

  return {
    buildAndPublishPayment,
    fetchPaymentsAccountExchange,
    fetchPaymentsTradingAccount,
    getWithdrawalLockCheck,
    showWithdrawalLockAlert,
    notifyNonCustodialToCustodialTransfer,
    paymentGetOrElse
  }
}
