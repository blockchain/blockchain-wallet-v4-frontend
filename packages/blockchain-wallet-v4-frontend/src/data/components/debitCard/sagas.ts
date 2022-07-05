import { call, put, select } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { errorHandler } from '@core/utils'
import { actions, selectors } from 'data'
import { CardStateType } from 'data/components/debitCard/types'
import { ModalName } from 'data/modals/types'
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

  const getEligibleAccounts = function* () {
    yield put(A.getEligibleAccountsLoading())
    const { id } = yield select(selectors.components.debitCard.getCurrentCardSelected)
    try {
      const data = yield call(api.getDCEligibleAccounts, id)
      yield put(A.getEligibleAccountsSuccess(data))
    } catch (e) {
      console.error('Failed to get eligible accounts', errorHandler(e))
      yield put(A.getEligibleAccountsFailure(e))
    }
  }

  const findAccount = (currentAccountSymbol, accounts) => {
    return accounts.find((account) => account?.balance?.symbol === currentAccountSymbol)
  }

  const getCurrentCardAccount = function* (cardId) {
    const eligibleAccounts = yield select(selectors.components.debitCard.getEligibleAccountsData)
    try {
      yield put(A.getCurrentCardAccountLoading())

      const { accountCurrency } = yield call(api.getDCCurrentAccount, cardId)

      const accountFound = findAccount(accountCurrency, eligibleAccounts)

      if (!accountCurrency || !accountFound) throw new Error('no_funds_obtained')

      yield put(A.getCurrentCardAccountSuccess(accountFound))
    } catch (e) {
      yield put(
        A.getCurrentCardAccountFailure(`Could not get current user funds, ${errorHandler(e)}`)
      )
    }
  }

  const getCardTransactions = function* (cardId) {
    yield put(A.getCardTransactionsLoading())
    try {
      const data = yield call(api.getDCTransactions, cardId)
      yield put(A.getCardTransactionsSuccess(data))
    } catch (e) {
      yield put(A.getCardTransactionsFailure(e))
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
        yield call(getEligibleAccounts)
        yield call(getCurrentCardAccount, cards[0].id)
        yield call(getCardTransactions, cards[0].id)
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
    yield put(A.terminateCardLoading())
    try {
      const { payload } = action
      yield call(api.terminateDC, payload)

      // Currently, we only manage 1 card
      yield put(A.cleanCardData())
      yield call(getCards)
      yield put(A.terminateCardSuccess())
    } catch (e) {
      console.error('Failed to terminate card', errorHandler(e))
      yield put(A.terminateCardFailure())
    }
  }

  const selectAccount = function* (action: ReturnType<typeof A.selectAccount>) {
    yield put(A.selectAccountLoading())
    try {
      const { id } = yield select(selectors.components.debitCard.getCurrentCardSelected)
      const { payload: symbol } = action

      yield call(api.selectDCAccount, id, symbol)
      yield call(getCurrentCardAccount, id)
      yield put(A.selectAccountSuccess(symbol))
    } catch (e) {
      // This will be logged until error display definition
      console.error('Failed to terminate card', errorHandler(e))
      yield put(A.selectAccountFailure(errorHandler(e)))
    } finally {
      yield put(actions.modals.closeModal(ModalName.FUNDS_LIST))
    }
  }

  return {
    createCard,
    getCards,
    getCurrentCardAccount,
    getEligibleAccounts,
    getProducts,
    handleCardLock,
    selectAccount,
    terminateCard
  }
}
