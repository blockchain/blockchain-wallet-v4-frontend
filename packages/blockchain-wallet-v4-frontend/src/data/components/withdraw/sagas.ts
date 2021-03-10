import { call, put } from 'redux-saga/effects'

import { APIType } from 'blockchain-wallet-v4/src/network/api'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { actions } from 'data'
import { WithdrawStepEnum } from 'data/types'

import { convertStandardToBase } from '../exchange/services'
import * as A from './actions'

const SERVICE_NAME = 'simplebuy'

export default ({ api }: { api: APIType }) => {
  const handleWithdrawSubmit = function * ({
    payload
  }: ReturnType<typeof A.handleCustodyWithdraw>) {
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
        yield put(
          actions.core.data.fiat.fetchTransactions(payload.fiatCurrency, true)
        )
        yield put(
          A.setStep({
            step: WithdrawStepEnum.WITHDRAWAL_DETAILS,
            withdrawal
          })
        )
      }
    } catch (e) {
      const error = errorHandler(e)
      yield put(
        actions.form.stopSubmit(WITHDRAW_CONFIRM_FORM, { _error: error })
      )
    }
  }

  const showModal = function * ({ payload }: ReturnType<typeof A.showModal>) {
    const { fiatCurrency } = payload

    yield put(
      actions.modals.showModal('CUSTODY_WITHDRAW_MODAL', {
        origin: 'TransactionList'
      })
    )

    yield put(A.setStep({ step: WithdrawStepEnum.LOADING }))

    try {
      // If user is not eligible for the requested fiat the route will 400
      // and this code will throw so no need to check the response body
      yield call(api.getSBPaymentAccount, fiatCurrency)
    } catch (e) {
      return yield put(A.setStep({ step: WithdrawStepEnum.INELIGIBLE }))
    }

    yield put(A.setStep({ step: WithdrawStepEnum.ENTER_AMOUNT, fiatCurrency }))
  }

  const fetchFees = function * (
    action: ReturnType<typeof A.fetchWithdrawalFees>
  ) {
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

  const fetchWithdrawLocks = function * () {
    yield put(A.fetchWithdrawalFeesLoading())
    try {
      const locks: ReturnType<typeof api.getWithdrawalLocks> = yield call(
        api.getWithdrawalLocks
      )
      yield put(A.fetchWithdrawalLockSuccess(locks))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchWithdrawalLockFailure(error))
    }
  }

  return {
    handleWithdrawSubmit,
    showModal,
    fetchFees,
    fetchWithdrawLocks
  }
}
