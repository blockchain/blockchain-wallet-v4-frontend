import { call, put, select } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { errorHandler } from '@core/utils'
import { actions, selectors } from 'data'
import { CardStateType, ResidentialAddress } from 'data/components/debitCard/types'
import { ModalName } from 'data/modals/types'
import profileSagas from 'data/modules/profile/sagas'

import {
  DebitCardError,
  OrderCardStep,
  RESIDENTIAL_ADDRESS_FORM,
  SOCIAL_SECURITY_NUMBER_FORM
} from './model'
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

  const getCurrentCardAccount = function* () {
    const selectedCard = yield select(selectors.components.debitCard.getCurrentCardSelected)
    const eligibleAccounts = yield select(selectors.components.debitCard.getEligibleAccountsData)
    try {
      yield put(A.getCurrentCardAccountLoading())

      const { accountCurrency } = yield call(api.getDCCurrentAccount, selectedCard.id)

      const accountFound = findAccount(accountCurrency, eligibleAccounts)

      if (!accountCurrency || !accountFound) throw new Error('no_funds_obtained')

      yield put(A.getCurrentCardAccountSuccess(accountFound))
    } catch (e) {
      yield put(
        A.getCurrentCardAccountFailure(`Could not get current user funds, ${errorHandler(e)}`)
      )
    }
  }

  const getCardTransactions = function* (action: ReturnType<typeof A.getCardTransactions>) {
    const selectedCard = yield select(selectors.components.debitCard.getCurrentCardSelected)

    yield put(A.getCardTransactionsLoading())

    try {
      const data = yield call(api.getDCTransactions, {
        cardId: selectedCard.id,
        limit: action.payload.limit
      })
      yield put(A.getCardTransactionsSuccess(data))
    } catch (e) {
      yield put(A.getCardTransactionsFailure(e))
    }
  }

  const getCards = function* () {
    try {
      yield put(A.getCardsLoading())

      yield put(A.getLegalRequirements())

      let cards = yield call(api.getDCCreated)

      cards = filterTerminatedCards(cards)

      yield put(A.getCardsSuccess(cards))

      if (cards.length > 0) {
        yield put(A.setCurrentCardSelected(cards[0]))

        yield call(getCardToken, cards[0].id)

        yield call(getEligibleAccounts)

        yield call(getCurrentCardAccount)

        yield put(A.getCardTransactions({ limit: 4 }))
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
      const { ssn } = selectors.form.getFormValues(SOCIAL_SECURITY_NUMBER_FORM)(yield select()) as {
        ssn: string
      }

      const legalRequirementsR = selectors.components.debitCard.getLegalRequirements(yield select())

      const legalRequirements = legalRequirementsR.getOrFail(DebitCardError.NO_LEGAL_REQUIREMENTS)

      const acceptedRequirements = legalRequirements.map((requirement) => ({
        acceptedVersion: requirement.version,
        name: requirement.name
      }))

      yield call(api.acceptLegalRequirements, acceptedRequirements)

      const { payload: productCode } = action

      yield put(A.createCardLoading())

      const data = yield call(api.createDCOrder, { productCode, ssn })

      yield put(A.createCardSuccess(data))

      yield put(A.getCards())
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

  const getResidentialAddress = function* () {
    try {
      yield put(A.getResidentialAddressLoading())

      const data = yield call(api.getDCResidentialAddress)

      yield put(A.getResidentialAddressSuccess(data.address))
    } catch (e) {
      yield put(A.getResidentialAddressFailure(e))
    }
  }

  const submitResidentialAddress = function* () {
    try {
      const formValues = selectors.form.getFormValues(RESIDENTIAL_ADDRESS_FORM)(
        yield select()
      ) as ResidentialAddress

      yield put(A.submitResidentialAddressLoading())

      const data = yield call(api.setDCResidentialAddress, formValues)

      yield put(A.submitResidentialAddressSuccess(data.address))

      yield put(actions.components.debitCard.setOrderCardStep(OrderCardStep.SSN))
    } catch (e) {
      yield put(A.submitResidentialAddressFailure(e))
    }
  }

  const submitSocialSecurityNumber = function* () {
    yield put(actions.components.debitCard.setOrderCardStep(OrderCardStep.SELECT_CARD))
  }

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
      yield call(getCurrentCardAccount)
      yield put(A.selectAccountSuccess(symbol))
    } catch (e) {
      // This will be logged until error display definition
      console.error('Failed to terminate card', errorHandler(e))
      yield put(A.selectAccountFailure(errorHandler(e)))
    } finally {
      yield put(actions.modals.closeModal(ModalName.FUNDS_LIST))
    }
  }

  const getLegalRequirements = function* () {
    try {
      const data = yield call(api.getLegalRequirements)

      yield put(A.getLegalRequirementsSuccess(data))
    } catch (e) {
      yield put(A.getLegalRequirementsFailure(e))
    }
  }

  return {
    createCard,
    getCardTransactions,
    getCards,
    getCurrentCardAccount,
    getEligibleAccounts,
    getLegalRequirements,
    getProducts,
    getResidentialAddress,
    handleCardLock,
    selectAccount,
    submitResidentialAddress,
    submitSocialSecurityNumber,
    terminateCard
  }
}
