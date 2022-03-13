import { call, put, select } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { errorHandler } from '@core/utils'

import { actions as A } from './slice'

export default ({ api }: { api: APIType }) => {
  const getProducts = function* () {
    try {
      const data = yield call(api.getDCProducts)
      yield put(A.getProductsSuccess(data))
    } catch (e) {
      console.error('Failed to get card products', errorHandler(e))
      yield put(A.getProductsFailure())
    }
  }
  const createCard = function* (action: ReturnType<typeof A.createCard>) {
    try {
      yield put(A.createCardLoading())
      const { payload } = action
      const orderId = yield call(api.createDCOrder, payload)
      yield put(A.createCardSuccess(orderId))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.createCardFailure(error))
    }
  }

  return {
    createCard,
    getProducts
  }
}
