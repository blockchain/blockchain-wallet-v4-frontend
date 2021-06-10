import { call, put } from 'redux-saga/effects'

import { displayFiatToFiat } from 'blockchain-wallet-v4/src/exchange'
import { APIType } from 'blockchain-wallet-v4/src/network/api'
import { SBPaymentMethodType, SBPaymentTypes } from 'blockchain-wallet-v4/src/types'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { actions } from 'data'
import { WithdrawStepEnum } from 'data/types'

import { convertStandardToBase } from '../exchange/services'
import * as A from './actions'

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

    const paymentMethods: SBPaymentMethodType[] = yield call(
      api.getSBPaymentMethods,
      fiatCurrency,
      true
    )

    const eligibleMethods = paymentMethods.filter(
      (method) =>
        method.currency === fiatCurrency &&
        (method.type === SBPaymentTypes.BANK_ACCOUNT ||
          method.type === SBPaymentTypes.BANK_TRANSFER)
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

  const fetchWithdrawLocks = function* () {
    yield put(A.fetchWithdrawalFeesLoading())
    try {
      const locks: ReturnType<typeof api.getWithdrawalLocks> = yield call(api.getWithdrawalLocks)
      yield put(A.fetchWithdrawalLockSuccess(locks))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchWithdrawalLockFailure(error))
    }
  }

  return {
    fetchFees,
    fetchWithdrawLocks,
    handleWithdrawMaxAmountClick,
    handleWithdrawMinAmountClick,
    handleWithdrawSubmit,
    showModal
  }
}
