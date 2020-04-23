import * as A from './actions'
import { actions, selectors } from 'data'
import { APIType } from 'core/network/api'
import { call, put, select } from 'redux-saga/effects'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { initialize } from 'redux-form'
import { nth } from 'ramda'

export default ({ api }: { api: APIType }) => {
  const fetchInterestEligible = function * () {
    try {
      yield put(A.fetchInterestEligibleLoading())
      const response: ReturnType<typeof api.getInterestEligible> = yield call(
        api.getInterestEligible
      )
      yield put(A.fetchInterestEligibleSuccess(response.interestEligible))
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

  const fetchInterestPaymentAccount = function * ({
    cryptoCurrency
  }: ReturnType<typeof A.fetchInterestPaymentAccount>) {
    try {
      yield put(A.fetchInterestPaymentAccountLoading())
      const response: ReturnType<
        typeof api.getInterestPaymentAccount
      > = yield call(api.getInterestPaymentAccount, cryptoCurrency)
      yield put(A.fetchInterestPaymentAccountSuccess(response))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchInterestPaymentAccountFailure(error))
    }
  }

  const initializeInterest = function * ({
    payload
  }: ReturnType<typeof A.initializeInterest>) {
    let defaultAccountR

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
      depositAmount: 0,
      'interest-deposit-select': defaultAccountR.getOrElse()
    }

    yield put(initialize('interestForm', initialValues))
  }

  const showInterestModal = function * ({
    payload
  }: ReturnType<typeof A.showInterestModal>) {
    yield put(A.setInterestStep(payload.step))
    yield put(actions.modals.showModal('INTEREST_MODAL'))
  }

  return {
    fetchInterestEligible,
    fetchInterestInstruments,
    fetchInterestLimits,
    fetchInterestPaymentAccount,
    initializeInterest,
    showInterestModal
  }
}
