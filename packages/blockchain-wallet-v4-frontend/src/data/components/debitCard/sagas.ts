import { isEmpty } from 'ramda'
import { call, put, select } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { errorHandler } from '@core/utils'
import { selectors } from 'data'

import { actions as A } from './slice'

export default ({ api }: { api: APIType }) => {
  const getCardToken = function* (cardId) {
    try {
      const data = yield call(api.getDCToken, cardId)

      yield put(A.setCardToken(data.token))
    } catch (e) {
      console.error('Failed to get card token', errorHandler(e))
    }
  }

  const filterTerminatedCards = (cards) => cards.filter((card) => card.status !== 'TERMINATED')

  const getCards = function* () {
    try {
      let cards = yield call(api.getDCCreated)

      cards = filterTerminatedCards(cards)
      if (cards.length > 0) {
        yield call(getCardToken, cards[0].id)
      }
      yield put(A.getCardsSuccess(cards))
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

      yield call(getCards)
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
