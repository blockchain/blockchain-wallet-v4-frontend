import { call, put, select } from 'redux-saga/effects'

import { actions, selectors } from 'data'

import { actions as A } from './slice'
import { RecurringBuyPeriods, RecurringBuyRegisteredList, RecurringBuyStepType } from './types'
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
        inputValue: '',
        inputCurrency: '',
        destinationCurrency: '',
        period: '',
        paymentMethod: '',
        paymentMethodId: ''
      }
      const order = selectors.components.simpleBuy.getSBOrder(yield select())
      if (!order) throw 'To make a recurring buy, more information is needed'
      
      const { inputQuantity, inputCurrency, outputCurrency, paymentType, paymentMethodId } = order
      const period = selectors.components.recurringBuy.getPeriod(yield select())
      if (inputQuantity && inputCurrency && outputCurrency && paymentType && paymentMethodId && period) {
        body.inputValue = inputQuantity
        body.inputCurrency = inputCurrency
        body.destinationCurrency = outputCurrency
        body.period = period
        body.paymentMethod = paymentType 
        body.paymentMethodId = paymentMethodId
      } else {
        throw 'To make a recurring buy, more information is needed'
      }

      const data:RecurringBuyRegisteredList = yield call(api.createRecurringBuy, body)
      yield put(A.setActive(data))
      yield put(A.fetchRegisteredList())
      yield put(A.setStep({ step: RecurringBuyStepType.SUMMARY }))
    } catch (error) {
      yield put(A.setStep({ step: RecurringBuyStepType.FAILURE })) 
    }
  }

  return {
    createRecurringBuy,
    fetchMethods,
    fetchRegisteredList,
    showModal
  }
}
