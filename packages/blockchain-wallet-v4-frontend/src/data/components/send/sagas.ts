import * as A from './actions'
import { actions, model, selectors } from 'data'
import { call, put, select } from 'redux-saga/effects'

import { APIType } from 'core/network/api'
import { BeneficiaryType } from 'core/types'
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

  return {
    fetchPaymentsAccountExchange,
    fetchPaymentsTradingAccount,
    notifyNonCustodialToCustodialTransfer,
    getWithdrawalLockCheck
  }
}
