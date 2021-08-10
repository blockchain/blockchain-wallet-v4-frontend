import { call, put, select } from 'redux-saga/effects'

import { APIType } from 'core/network/api'
import { actions, selectors } from 'data'

import { actions as A } from './slice'
import {
  RecurringBuyItemState,
  RecurringBuyPeriods,
  RecurringBuyRegisteredList,
  RecurringBuyStepType
} from './types'

export default ({ api }: { api: APIType }) => {
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

  const fetchRegisteredList = function* () {
    yield put(A.registeredListLoading())
    try {
      const data = yield call(api.getRBRegisteredList)
      yield put(A.registeredListSuccess(data))
    } catch (error) {
      yield put(A.registeredListFailure(error))
    }
  }

  const createRecurringBuy = function* () {
    try {
      const body = {
        destinationCurrency: '',
        inputCurrency: '',
        inputValue: '',
        paymentMethod: '',
        paymentMethodId: '',
        period: ''
      }
      const order = selectors.components.simpleBuy.getSBOrder(yield select())
      if (!order) throw new Error('To make a recurring buy, more information is needed')

      const { inputCurrency, inputQuantity, outputCurrency, paymentMethodId, paymentType } = order
      const period = selectors.components.recurringBuy.getPeriod(yield select())
      if (
        inputQuantity &&
        inputCurrency &&
        outputCurrency &&
        paymentType &&
        paymentMethodId &&
        period
      ) {
        body.inputValue = inputQuantity
        body.inputCurrency = inputCurrency
        body.destinationCurrency = outputCurrency
        body.period = period
        body.paymentMethod = paymentType
        body.paymentMethodId = paymentMethodId
      } else {
        throw new Error('To make a recurring buy, more information is needed')
      }

      const data: RecurringBuyRegisteredList = yield call(api.createRecurringBuy, body)
      yield put(A.setActive(data))
      yield put(A.fetchRegisteredList())
      yield put(A.setStep({ step: RecurringBuyStepType.SUMMARY }))
    } catch (error) {
      yield put(A.setStep({ step: RecurringBuyStepType.FAILURE }))
    }
  }

  const removeRecurringBuy = function* ({ payload }: ReturnType<typeof A.removeRecurringBuy>) {
    try {
      const data: RecurringBuyRegisteredList = yield call(api.deleteRecurringBuy, payload)
      if (data.state === RecurringBuyItemState.INACTIVE) {
        yield put(A.fetchRegisteredList())
        yield put(actions.modals.closeModal())
      }
    } catch (error) {
      // toast notif
      yield put(actions.modals.closeModal())
    }
  }

  return {
    createRecurringBuy,
    fetchMethods,
    fetchRegisteredList,
    removeRecurringBuy,
    showModal
  }
}
