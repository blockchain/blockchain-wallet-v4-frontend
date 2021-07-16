import { put } from 'redux-saga/effects'

import { actions } from 'data'

import { actions as A } from './slice'
import { RecurringBuyStepType } from './types'

export default () => {
  const showModal = function* ({ payload }: ReturnType<typeof A.showModal>) {
    const { origin } = payload
    yield put(
      actions.modals.showModal('RECURRING_BUYS_MODAL', {
        origin
      })
    )

    yield put(
      A.setStep({
        step: RecurringBuyStepType.INIT_PAGE
      })
    )
  }

  return {
    showModal
  }
}
