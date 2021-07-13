import { put } from 'redux-saga/effects'

import { actions } from 'data'

import * as A from './actions'
import { RecurringBuysStepType } from './types'

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
        step: RecurringBuysStepType.INIT_PAGE
      })
    )
  }

  return {
    showModal
  }
}
