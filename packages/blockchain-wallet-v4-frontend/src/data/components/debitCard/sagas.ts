import { isEmpty } from 'ramda'
import { call, put, select } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { errorHandler } from '@core/utils'
import { selectors } from 'data'

import { actions as A } from './slice'

export default ({ api }: { api: APIType }) => {
  const getCards = function* () {
    try {
      const data = yield call(api.getDCCreated)
      yield put(A.getCardsSuccess(data))
    } catch (e) {
      console.error('Failed to get account cards', errorHandler(e))
      yield put(A.getCardsFailure())
    }
  }

  const getProducts = function* () {
    const debitCardModuleEnabled = (yield select(
      selectors.core.walletOptions.getWalletDebitCardEnabled
    )).getOrElse(false)
    if (debitCardModuleEnabled) {
      try {
        const products = yield call(api.getDCProducts)
        yield put(A.getProductsSuccess(products))

        // If the account is eligible it will get products
        if (!isEmpty(products)) {
          // Get the cards the user might have created before
          yield call(getCards)
        }
      } catch (e) {
        console.error('Failed to get card products', errorHandler(e))
        yield put(A.getProductsFailure())
      }
    }
  }
  const createCard = function* (action: ReturnType<typeof A.createCard>) {
    try {
      yield put(A.createCardLoading())
      const { payload } = action
      const data = yield call(api.createDCOrder, payload)
      yield put(A.createCardSuccess(data))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.createCardFailure(error))
    }
  }

  return {
    createCard,
    getCards,
    getProducts
  }
}
