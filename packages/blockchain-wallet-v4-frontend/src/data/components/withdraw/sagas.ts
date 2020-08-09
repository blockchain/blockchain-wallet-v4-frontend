import { call, put } from 'redux-saga/effects'

import * as A from './actions'
import { actions } from 'data'
import { APIType } from 'core/network/api'
import { convertStandardToBase } from '../exchange/services'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'

export default ({ api }: { api: APIType }) => {
  const handleWithdrawSubmit = function * ({
    payload
  }: ReturnType<typeof A.handleCustodyWithdraw>) {
    try {
      yield put(actions.form.startSubmit('confirmCustodyWithdraw'))
      const withdrawal: ReturnType<typeof api.withdrawFunds> = yield call(
        api.withdrawFunds,
        payload.beneficiary,
        payload.fiatCurrency,
        convertStandardToBase('FIAT', payload.amount)
      )
      yield put(actions.form.stopSubmit('confirmCustodyWithdraw'))
      yield put(
        actions.core.data.fiat.fetchTransactions(payload.fiatCurrency, true)
      )
      yield put(A.setStep({ step: 'WITHDRAWAL_DETAILS', withdrawal }))
    } catch (e) {
      const error = errorHandler(e)
      yield put(
        actions.form.stopSubmit('confirmCustodyWithdraw', { _error: error })
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

    yield put(A.setStep({ step: 'ENTER_AMOUNT', fiatCurrency }))
  }

  return {
    handleWithdrawSubmit,
    showModal
  }
}
