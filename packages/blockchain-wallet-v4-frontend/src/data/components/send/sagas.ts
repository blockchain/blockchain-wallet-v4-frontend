import moment from 'moment'
import { FormAction } from 'redux-form'
import { call, CallEffect, delay, put, select } from 'redux-saga/effects'

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
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
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
    coin: CoinType,
    payment: PaymentType,
    destination: string
  ): Generator<PaymentType | CallEffect, PaymentValue, any> {
    // eslint-disable-next-line no-useless-catch
    try {
      if (coin === 'XLM') {
        // separate out addresses and memo
        const depositAddressMemo = destination.split(':')
        // eslint-disable-next-line no-param-reassign
        payment = yield payment.to(depositAddressMemo[0], 'CUSTODIAL')
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        payment = yield payment.memo(depositAddressMemo[1])
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        payment = yield payment.memoType('text')
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        payment = yield payment.setDestinationAccountExists(true)
      } else {
        // eslint-disable-next-line no-param-reassign
        payment = yield payment.to(destination, 'CUSTODIAL')
      }
      // eslint-disable-next-line no-param-reassign
      payment = yield payment.build()
      // ask for second password
      const password = yield call(promptForSecondPassword)
      // eslint-disable-next-line no-param-reassign
      payment = yield payment.sign(password)
      // eslint-disable-next-line no-param-reassign
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
      const tradingAccount: BeneficiaryType = yield call(api.getSBPaymentAccount, currency)
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
      const payment: SBOrderType = yield select(selectors.components.simpleBuy.getSBOrder)

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
        payment.paymentType === SBPaymentTypes.BANK_TRANSFER ||
        payment.paymentType === SBPaymentTypes.PAYMENT_CARD
          ? payment.paymentType
          : SBPaymentTypes.BANK_TRANSFER

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
    switch (coin) {
      case 'BCH':
        return coreSagas.payment.bch.create({
          network: networks.bch,
          payment: paymentR.getOrElse(<PaymentValue>{})
        })
      case 'BTC':
        return coreSagas.payment.btc.create({
          network: networks.btc,
          payment: paymentR.getOrElse(<PaymentValue>{})
        })
      case 'ETH':
      case 'PAX':
      case 'USDT':
      case 'WDGLD':
      case 'AAVE':
      case 'YFI':
        return coreSagas.payment.eth.create({
          network: networks.eth,
          payment: paymentR.getOrElse(<PaymentValue>{})
        })
      case 'XLM':
        return coreSagas.payment.xlm.create({
          payment: paymentR.getOrElse(<PaymentValue>{})
        })
      case 'ALGO':
      case 'DOT':
        // @ts-ignore
        return {}
      default:
        throw new Error(INVALID_COIN_TYPE)
    }
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
