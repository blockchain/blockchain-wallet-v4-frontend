import moment from 'moment'
import { FormAction } from 'redux-form'
import { call, CallEffect, delay, put, select } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import {
  BeneficiaryType,
  BSOrderType,
  BSPaymentTypes,
  CoinType,
  PaymentType,
  PaymentValue,
  RemoteDataType,
  WalletFiatType
} from '@core/types'
import { errorHandler } from '@core/utils'
import { actions, model, selectors } from 'data'
import * as C from 'services/alerts'
import { promptForSecondPassword } from 'services/sagas'

import profileSagas from '../../modules/profile/sagas'
import * as A from './actions'

const { BAD_2FA } = model.profile.ERROR_TYPES
const { WITHDRAW_LOCK_DEFAULT_DAYS } = model.profile

export default ({ api, coreSagas, networks }: { api: APIType; coreSagas: any; networks: any }) => {
  const logLocation = 'components/send/sagas'
  const { waitForUserData } = profileSagas({ api, coreSagas, networks })

  const buildAndPublishPayment = function* (
    coin: string,
    payment: PaymentType,
    destination: string,
    hotwalletAddress?: string
  ): Generator<PaymentType | CallEffect, PaymentValue, any> {
    // eslint-disable-next-line no-useless-catch
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
      } else if (hotwalletAddress && payment.coin === 'ETH') {
        // @ts-ignore
        payment = yield payment.depositAddress(destination)
        payment = yield payment.to(hotwalletAddress)
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

  const fetchPaymentsTradingAccount = function* (action) {
    const { currency } = action.payload
    try {
      yield put(A.fetchPaymentsTradingAccountLoading(currency))
      const tradingAccount: BeneficiaryType = yield call(api.getBSPaymentAccount, currency)
      yield put(A.fetchPaymentsTradingAccountSuccess(currency, tradingAccount))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'fetchPaymentsTradingAccount', e))
      yield put(A.fetchPaymentsTradingAccountFailure(currency, e))
    }
  }

  const fetchPaymentsAccountExchange = function* (action) {
    const { currency } = action.payload
    try {
      yield call(fetchPaymentsTradingAccount, { payload: { currency } })
      yield call(waitForUserData)
      const isExchangeAccountLinked = (yield select(
        selectors.modules.profile.isExchangeAccountLinked
      )).getOrElse(false)
      if (!isExchangeAccountLinked) throw new Error('Wallet is not linked to Exchange')
      yield put(A.fetchPaymentsAccountExchangeLoading(currency))
      const data = yield call(api.getPaymentsAccountExchange, currency)
      yield put(A.fetchPaymentsAccountExchangeSuccess(currency, data))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'fetchPaymentsAccountExchange', e))
      if (e.type === BAD_2FA) {
        yield put(A.fetchPaymentsAccountExchangeSuccess(currency, { address: e.type }))
      } else {
        yield put(A.fetchPaymentsAccountExchangeFailure(currency, e))
      }
    }
  }

  const fetchUnstoppableDomainResults = function* (
    action: ReturnType<typeof A.fetchUnstoppableDomainResults>
  ) {
    const { payload } = action
    try {
      yield put(A.fetchUnstoppableDomainResultsLoading())
      const results: ReturnType<typeof api.getUnstoppableDomainResults> = yield call(
        api.getUnstoppableDomainResults,
        payload.name,
        payload.currency
      )
      yield delay(1000)
      yield put(A.fetchUnstoppableDomainResultsSuccess(results))
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.logs.logErrorMessage(logLocation, 'getWithdrawalLockCheck', error))
      yield put(A.fetchUnstoppableDomainResultsFailure(''))
    }
  }

  const notifyNonCustodialToCustodialTransfer = function* (
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
      typeof payment.amount === 'string' ? payment.amount : payment.amount[0].toString()

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

  const getWithdrawalLockCheck = function* () {
    try {
      yield put(A.getLockRuleLoading())
      const payment: BSOrderType = yield select(selectors.components.buySell.getBSOrder)

      const fiatCurrency: WalletFiatType = yield select(
        selectors.components.buySell.getFiatCurrency
      )
      const state = yield select()
      const settingsCurrency: WalletFiatType = selectors.core.settings
        .getCurrency(state)
        .getOrElse('USD')

      const currency = fiatCurrency || settingsCurrency

      // Lock rule can only be called with BANK_TRANSFER and PAYMENT_CARD
      // Adding check here to only pass those too, else pass BANK_TRANSFER
      const withdrawalCheckPayment: BSPaymentTypes =
        payment &&
        (payment.paymentType === BSPaymentTypes.BANK_TRANSFER ||
          payment.paymentType === BSPaymentTypes.PAYMENT_CARD)
          ? payment.paymentType
          : BSPaymentTypes.BANK_TRANSFER

      const withdrawalLockCheckResponse = yield call(
        api.checkWithdrawalLocks,
        withdrawalCheckPayment,
        currency
      )
      yield put(A.getLockRuleSuccess(withdrawalLockCheckResponse))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'getWithdrawalLockCheck', e))
      yield put(A.getLockRuleFailure(e))
    }
  }

  const showWithdrawalLockAlert = function* () {
    try {
      yield call(getWithdrawalLockCheck)
      const rule =
        (yield select(selectors.components.send.getWithdrawLockCheckRule)).getOrElse(
          WITHDRAW_LOCK_DEFAULT_DAYS
        ) || WITHDRAW_LOCK_DEFAULT_DAYS
      const days =
        typeof rule === 'object' ? moment.duration(rule.lockTime, 'seconds').days() : rule
      yield put(
        actions.alerts.displayError(C.LOCKED_WITHDRAW_ERROR, {
          days
        })
      )
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'showWithdrawalLockAlert', e))
    }
  }

  const paymentGetOrElse = (
    coin: CoinType,
    paymentR: RemoteDataType<string | Error, PaymentValue | undefined>
  ): PaymentType => {
    const { parentChain = coin } = window.coins[coin].coinfig.type
    const coinLower = parentChain.toLowerCase()
    const saga = coreSagas.payment[coinLower]

    if (saga) {
      return saga.create({
        network: networks[coinLower],
        payment: paymentR.getOrElse(<PaymentValue>{})
      })
    }
    // @ts-ignore
    return {}
  }

  const formChanged = function* (action: FormAction) {
    const { field } = action.meta
    if (field === 'to') {
      yield put(A.fetchUnstoppableDomainResultsNotAsked())
    }
  }

  return {
    buildAndPublishPayment,
    fetchPaymentsAccountExchange,
    fetchPaymentsTradingAccount,
    fetchUnstoppableDomainResults,
    formChanged,
    getWithdrawalLockCheck,
    notifyNonCustodialToCustodialTransfer,
    paymentGetOrElse,
    showWithdrawalLockAlert
  }
}
