import { call, put, select } from 'redux-saga/effects'

import { displayFiatToFiat } from '@core/exchange'
import { APIType } from '@core/network/api'
import { BSPaymentMethodType, BSPaymentTypes, FiatType } from '@core/types'
import { errorHandler } from '@core/utils'
import { actions, selectors } from 'data'
import { WithdrawStepEnum } from 'data/types'

import { convertStandardToBase } from '../exchange/services'
import { actions as A } from './slice'

const SERVICE_NAME = 'simplebuy'

export default ({ api }: { api: APIType }) => {
  const handleWithdrawSubmit = function* ({ payload }: ReturnType<typeof A.handleCustodyWithdraw>) {
    const WITHDRAW_CONFIRM_FORM = 'confirmCustodyWithdraw'

    try {
      yield put(actions.form.startSubmit(WITHDRAW_CONFIRM_FORM))
      if (payload.beneficiary) {
        const withdrawal: ReturnType<typeof api.withdrawFunds> = yield call(
          api.withdrawFunds,
          payload.beneficiary,
          payload.fiatCurrency,
          convertStandardToBase('FIAT', payload.amount)
        )
        yield put(actions.form.stopSubmit(WITHDRAW_CONFIRM_FORM))
        yield put(actions.core.data.fiat.fetchTransactions(payload.fiatCurrency, true))
        yield put(
          A.setStep({
            step: WithdrawStepEnum.WITHDRAWAL_DETAILS,
            withdrawal
          })
        )
      }
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit(WITHDRAW_CONFIRM_FORM, { _error: error }))
    }
  }

  const showModal = function* ({ payload }: ReturnType<typeof A.showModal>) {
    const { fiatCurrency } = payload

    yield put(
      actions.modals.showModal('CUSTODY_WITHDRAW_MODAL', {
        origin: 'TransactionList'
      })
    )

    yield put(A.setStep({ step: WithdrawStepEnum.LOADING }))

    const paymentMethods: BSPaymentMethodType[] = yield call(
      api.getBSPaymentMethods,
      fiatCurrency,
      true
    )

    const eligibleMethods = paymentMethods.filter(
      (method) =>
        method.currency === fiatCurrency &&
        (method.type === BSPaymentTypes.BANK_ACCOUNT ||
          method.type === BSPaymentTypes.BANK_TRANSFER)
    )

    if (eligibleMethods.length === 0) {
      return yield put(A.setStep({ step: WithdrawStepEnum.INELIGIBLE }))
    }

    yield put(A.setStep({ fiatCurrency, step: WithdrawStepEnum.ENTER_AMOUNT }))
  }

  const handleWithdrawMaxAmountClick = function* (
    action: ReturnType<typeof A.handleWithdrawMaxAmountClick>
  ) {
    yield put(
      actions.form.change(
        'custodyWithdrawForm',
        'amount',
        displayFiatToFiat({ value: action.payload.amount })
      )
    )
  }

  const handleWithdrawMinAmountClick = function* (
    action: ReturnType<typeof A.handleWithdrawMinAmountClick>
  ) {
    yield put(
      actions.form.change(
        'custodyWithdrawForm',
        'amount',
        displayFiatToFiat({ value: action.payload.amount })
      )
    )
  }

  const fetchFees = function* (action: ReturnType<typeof A.fetchWithdrawalFees>) {
    yield put(A.fetchWithdrawalFeesLoading())
    try {
      const withdrawalFees: ReturnType<typeof api.getWithdrawalFees> = yield call(
        api.getWithdrawalFees,
        SERVICE_NAME,
        action.payload.paymentMethod
      )

      yield put(A.fetchWithdrawalFeesSuccess(withdrawalFees))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchWithdrawalFeesFailure(error))
    }
  }

  const fetchWithdrawLocks = function* (action: ReturnType<typeof A.fetchWithdrawalLock>) {
    yield put(A.fetchWithdrawalFeesLoading())
    const currency =
      action.payload.currency ||
      (selectors.components.withdraw.getFiatCurrency(yield select()) as FiatType)
    try {
      const locks: ReturnType<typeof api.getWithdrawalLocks> = yield call(
        api.getWithdrawalLocks,
        currency
      )
      yield put(A.fetchWithdrawalLockSuccess(locks))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchWithdrawalLockFailure(error))
    }
  }

  const fetchCrossBorderLimits = function* ({
    payload
  }: ReturnType<typeof A.fetchCrossBorderLimits>) {
    const { currency, fromAccount, inputCurrency, outputCurrency, toAccount } = payload
    try {
      yield put(A.fetchCrossBorderLimitsLoading())
      const limitsResponse: ReturnType<typeof api.getCrossBorderTransactions> = yield call(
        api.getCrossBorderTransactions,
        inputCurrency,
        fromAccount,
        outputCurrency,
        toAccount,
        currency
      )
      yield put(A.fetchCrossBorderLimitsSuccess(limitsResponse))
    } catch (e) {
      yield put(A.fetchCrossBorderLimitsFailure(e))
    }
  }

  return {
    fetchCrossBorderLimits,
    fetchFees,
    fetchWithdrawLocks,
    handleWithdrawMaxAmountClick,
    handleWithdrawMinAmountClick,
    handleWithdrawSubmit,
    showModal
  }
}
