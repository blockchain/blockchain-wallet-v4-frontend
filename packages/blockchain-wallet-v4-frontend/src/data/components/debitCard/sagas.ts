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
      yield put(A.getCurrentCardAccountLoading())

      const data = yield call(api.getDCCurrentAccount, cardId)
      yield put(A.getCurrentCardAccountSuccess(data))
    } catch (e) {
      console.error('Failed to get current card account', errorHandler(e))
      const eligibleAccounts = yield select(selectors.components.debitCard.getEligibleAccounts)
      if (!isEmpty(eligibleAccounts)) {
        // In case of failure it is set the default account as current
        yield put(A.getCurrentCardAccountSuccess(eligibleAccounts[0]))
      } else {
        yield put(A.getCurrentCardAccountFailure('Could not get user funds'))
      }
    }
  }

  const getCards = function* () {
    try {
      yield put(A.getCardsLoading())
      let cards = yield call(api.getDCCreated)
      cards = filterTerminatedCards(cards)
      yield put(A.getCardsSuccess(cards))
      if (cards.length > 0) {
        yield put(A.setCurrentCardSelected(cards[0]))
        yield call(getCardToken, cards[0].id)
        yield call(getEligibleAccounts, cards[0].id)
        yield call(getCurrentCardAccount, cards[0].id)
      }
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

  const getUpdatedCards = (cards, id, updatedCard) =>
    cards.map((card) => {
      if (card.id === id) {
        return updatedCard
      }
      return card
    })

  const handleCardLock = function* (action: ReturnType<typeof A.handleCardLock>) {
    try {
      yield put(A.handleCardLockLoading())
      const { id, newLockState } = action.payload

      const lockAction = newLockState ? 'lock' : 'unlock'

      const updatedCard = yield call(api.handleDCLock, id, lockAction)
      const cardsR = yield select(selectors.components.debitCard.getCards)
      const updatedCardsR = cardsR.map((cards) => getUpdatedCards(cards, id, updatedCard))
      yield put(A.updateCurrentCard({ updatedCard, updatedCardsR }))
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
