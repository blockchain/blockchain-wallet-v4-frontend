import { put } from 'redux-saga/effects'

import * as A from './actions'
import { actions } from 'data'

export default () => {
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
    showModal
  }
}
