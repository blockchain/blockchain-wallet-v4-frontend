import * as A from './actions'
import { actions, model, selectors } from 'data'
import { call, CallEffect, put, select } from 'redux-saga/effects'

import { APIType } from 'core/network/api'
import {
  BeneficiaryType,
  CoinType,
  PaymentType,
  PaymentValue,
  RemoteDataType
} from 'core/types'
import { INVALID_COIN_TYPE } from 'blockchain-wallet-v4/src/model'
import { promptForSecondPassword } from 'services/SagaService'
import profileSagas from '../../modules/profile/sagas'

const { BAD_2FA } = model.profile.ERROR_TYPES

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
    const { payment } = payload

    if (!payment.to) return
    if (!payment.amount) return
    if (!payment.txId) return

    const toType = payment.to[0].type
    const fromType = payment.fromType

    if (toType !== 'CUSTODIAL') return // do nothing
    if (fromType === 'CUSTODIAL') return // do nothing

    const amount =
      typeof payment.amount === 'string'
        ? payment.amount
        : payment.amount[0].toString()

    const address = payment.to[0].address

    yield call(
      api.notifyNonCustodialToCustodialTransfer,
      payment.coin,
      address,
      payment.txId,
      amount,
      payload.product
    )
  }

  const getWithdrawalLockCheck = function * () {
    try {
      yield put(A.getLockRuleLoading())
      const withdrawalLockCheckResponse = yield call(
        api.checkWithdrawalLocks,
        'PAYMENT_CARD'
      )
      yield put(A.getLockRuleSuccess(withdrawalLockCheckResponse))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'fetchPaymentsTradingAccount',
          e
        )
      )
      yield put(A.getLockRuleFailure(e))
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
    notifyNonCustodialToCustodialTransfer,
    paymentGetOrElse
  }
}
