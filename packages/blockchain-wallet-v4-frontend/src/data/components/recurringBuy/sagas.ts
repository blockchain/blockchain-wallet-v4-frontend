import { call, put } from 'redux-saga/effects'

import { actions } from 'data'

import { actions as A } from './slice'
import { RecurringBuyPeriods, RecurringBuyStepType } from './types'
import { SBPaymentTypes } from 'core/types'
import { APIType } from 'core/network/api'

export default ({ api }: { api: APIType; }) => {
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

  const fetchMethods = function* () {
    yield put(A.methodsLoading())
    try {
      const data: { eligibleMethods: RecurringBuyPeriods[] } = yield call(api.getRBPaymentMethods)
      yield put(A.methodsSuccess(data.eligibleMethods))
    } catch (error) {
      yield put(A.methodsFailure(error))
    }
  }

  return {
    fetchMethods,
    showModal
  }
}
