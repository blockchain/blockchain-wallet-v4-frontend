import { isEmpty } from 'ramda'
import { call, put, select } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { errorHandler } from '@core/utils'
import { selectors } from 'data'
import { CardStateType } from 'data/components/debitCard/types'
import profileSagas from 'data/modules/profile/sagas'

import { actions as A } from './slice'

export default ({ api, coreSagas, networks }: { api: APIType; coreSagas: any; networks: any }) => {
  const { waitForUserData } = profileSagas({ api, coreSagas, networks })

  const getCardToken = function* (cardId) {
    try {
      const data = yield call(api.getDCToken, cardId)

      yield put(A.setCardToken(data.token))
    } catch (e) {
      console.error('Failed to get card token', errorHandler(e))
    }
  }

  const filterTerminatedCards = (cards) =>
    cards.filter((card) => card.status !== CardStateType.TERMINATED)

  const getEligibleAccounts = function* (cardId) {
    try {
      const data = yield call(api.getDCEligibleAccounts, cardId)
      yield put(A.setEligibleAccounts(data))
    } catch (e) {
      console.error('Failed to get eligible accounts', errorHandler(e))
    }
  }

  const getCurrentCardAccount = function* (cardId) {
    try {
      const data = yield call(api.getDCCurrentAccount, cardId)
      yield put(A.setCurrentCardAccount(data))
    } catch (e) {
      console.error('Failed to get current card account', errorHandler(e))
      yield put(A.setDefaultCurrentCardAccount())
    }
  }

  const getCards = function* () {
    try {
      let cards = yield call(api.getDCCreated)

      cards = filterTerminatedCards(cards)
      if (cards.length > 0) {
        yield call(getCardToken, cards[0].id)
        yield call(getEligibleAccounts, cards[0].id)
        yield call(getCurrentCardAccount, cards[0].id)
      }
      yield put(A.getCardsSuccess(cards))
    } catch (e) {
      console.error('Failed to get account cards', errorHandler(e))
      yield put(A.getCardsFailure())
    }
  }

  const getProducts = function* () {
    yield call(waitForUserData)
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

  const handleCardLock = function* (action: ReturnType<typeof A.handleCardLock>) {
    try {
      yield put(A.handleCardLockLoading())
      const { id, newLockState } = action.payload

      const lockAction = newLockState ? 'lock' : 'unlock'

      yield call(api.handleDCLock, id, lockAction)
      yield call(getCards)
      yield put(A.handleCardLockSuccess(newLockState))
    } catch (e) {
      yield put(A.handleCardLockFailure(e))
    }
  }

  const terminateCard = function* (action: ReturnType<typeof A.terminateCard>) {
    try {
      const { payload } = action
      yield call(api.terminateDC, payload)

      yield call(getCards)
    } catch (e) {
      console.error('Failed to terminate card', errorHandler(e))
    }
  }

  return {
    createCard,
    getCards,
    getProducts,
    handleCardLock,
    terminateCard
  }
}
