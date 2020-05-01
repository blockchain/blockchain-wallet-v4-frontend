import * as A from './actions'
import { actions, selectors } from 'data'
import { APIType } from 'core/network/api'
import { call, delay, put, select } from 'redux-saga/effects'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { initialize } from 'redux-form'
import { InterestTransactionResponseType } from 'core/types'
import { nth } from 'ramda'

export default ({ api }: { api: APIType }) => {
  const fetchInterestBalance = function * () {
    try {
      yield put(A.fetchInterestBalanceLoading())
      const response: ReturnType<
        typeof api.getInterestAccountBalance
      > = yield call(api.getInterestAccountBalance)
      yield put(A.fetchInterestBalanceSuccess(response))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchInterestBalanceFailure(error))
    }
  }
  const fetchInterestEligible = function * () {
    try {
      yield put(A.fetchInterestEligibleLoading())
      const response: ReturnType<typeof api.getInterestEligible> = yield call(
        api.getInterestEligible
      )
      yield put(A.fetchInterestEligibleSuccess(response))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchInterestEligibleFailure(error))
    }
  }

  const fetchInterestInstruments = function * () {
    try {
      yield put(A.fetchInterestInstrumentsLoading())
      const response: ReturnType<
        typeof api.getInterestInstruments
      > = yield call(api.getInterestInstruments)
      yield put(A.fetchInterestInstrumentsSuccess(response))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchInterestInstrumentsFailure(error))
    }
  }

  const fetchInterestLimits = function * () {
    try {
      yield put(A.fetchInterestLimitsLoading())
      const response: ReturnType<typeof api.getInterestLimits> = yield call(
        api.getInterestLimits
      )
      yield put(A.fetchInterestLimitsSuccess(response.limits))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchInterestLimitsFailure(error))
    }
  }

  const fetchInterestPaymentAccount = function * (coin) {
    try {
      yield put(A.fetchInterestPaymentAccountLoading())
      const paymentAccount = yield call(api.getInterestPaymentAccount, coin)
      yield put(A.fetchInterestPaymentAccountSuccess(paymentAccount))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchInterestPaymentAccountFailure(error))
    }
  }

  const fetchInterestRate = function * () {
    try {
      yield put(A.fetchInterestRateLoading())
      const response: ReturnType<
        typeof api.getInterestSavingsRate
      > = yield call(api.getInterestSavingsRate)
      yield put(A.fetchInterestRateSuccess(response))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchInterestRateFailure(error))
    }
  }

  const fetchInterestTransactions = function * () {
    try {
      yield put(A.fetchInterestTransactionsLoading())
      const transactions: InterestTransactionResponseType = yield call(
        api.getInterestTransactions
      )
      yield put(A.fetchInterestTransactionsSuccess(transactions))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchInterestTransactionsFailue(error))
    }
  }

  const initializeDepositForm = function * ({
    payload
  }: ReturnType<typeof A.initializeDepositForm>) {
    let defaultAccountR

    yield call(fetchInterestLimits)

    switch (payload.coin) {
      case 'BTC':
        const accountsR = yield select(
          selectors.core.common.btc.getAccountsBalances
        )
        const defaultIndex = yield select(
          selectors.core.wallet.getDefaultAccountIndex
        )
        defaultAccountR = accountsR.map(nth(defaultIndex))
        break
      default:
        break
    }
    const initialValues = {
      'interest-deposit-select': defaultAccountR.getOrElse()
    }

    yield put(initialize('interestDepositForm', initialValues))
  }

  const sendDeposit = function * () {
    const FORM = 'interestDepositForm'
    try {
      yield put(actions.form.startSubmit(FORM))
      yield delay(4000)
      yield put(actions.form.stopSubmit(FORM))
      yield put(A.setInterestStep('DEPOSIT_SUCCESS'))
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit(FORM, { _error: error }))
    }
  }

  const showInterestModal = function * ({
    payload
  }: ReturnType<typeof A.showInterestModal>) {
    yield put(A.setInterestStep(payload.step))
    yield put(actions.modals.showModal('INTEREST_MODAL'))
  }

  return {
    fetchInterestBalance,
    fetchInterestEligible,
    fetchInterestInstruments,
    fetchInterestLimits,
    fetchInterestPaymentAccount,
    fetchInterestRate,
    fetchInterestTransactions,
    initializeDepositForm,
    sendDeposit,
    showInterestModal
  }
}
