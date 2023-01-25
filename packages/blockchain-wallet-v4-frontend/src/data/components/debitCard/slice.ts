import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'
import { RemoteDataType } from '@core/remote/types'

import { OrderCardStep } from './model'
import {
  AccountType,
  CardActionType,
  CardTransaction,
  DebitCardState,
  DebitCardType,
  LegalRequirement,
  ProductType,
  ResidentialAddress
} from './types'

const initialState: DebitCardState = {
  cardCreationData: Remote.NotAsked,
  cardToken: '',
  cards: Remote.NotAsked,
  currentCardAccount: Remote.NotAsked,
  currentCardSelected: undefined,
  eligibleAccounts: Remote.NotAsked,
  legal: Remote.NotAsked,
  lockHandler: Remote.NotAsked,
  orderCardStep: OrderCardStep.RESIDENTIAL_ADDRESS,
  products: [],
  residentialAddress: Remote.NotAsked,
  selectAccountHandler: Remote.NotAsked,
  terminateHandler: Remote.NotAsked,
  transactions: Remote.NotAsked
}

const debitCardSlice = createSlice({
  initialState,
  name: 'debitCard',
  reducers: {
    cleanCardData: (state) => {
      state.cards = Remote.NotAsked
      state.cardToken = ''
      state.currentCardSelected = undefined
      state.currentCardAccount = Remote.NotAsked
      state.lockHandler = Remote.NotAsked
      state.transactions = Remote.NotAsked
      state.residentialAddress = Remote.NotAsked
      state.orderCardStep = OrderCardStep.RESIDENTIAL_ADDRESS
    },
    cleanTerminateHandler: (state) => {
      state.terminateHandler = Remote.NotAsked
    },
    createCard: (state, action: PayloadAction<string>) => {},
    createCardFailure: (state, action: PayloadAction<string>) => {
      state.cardCreationData = Remote.Failure(action.payload)
    },
    createCardLoading: (state) => {
      state.cardCreationData = Remote.Loading
    },
    createCardSuccess: (state, action: PayloadAction<DebitCardType>) => {
      state.cardCreationData = Remote.Success(action.payload)
    },
    getCardTransactions: (state, action: PayloadAction<{ limit: number }>) => {},
    getCardTransactionsFailure: (state, action: PayloadAction<string>) => {
      state.transactions = Remote.Failure(action.payload)
    },
    getCardTransactionsLoading: (state) => {
      state.transactions = Remote.Loading
    },
    getCardTransactionsSuccess: (state, action: PayloadAction<Array<CardTransaction>>) => {
      state.transactions = Remote.Success(action.payload)
    },
    getCards: () => {},
    getCardsFailure: (state) => {
      state.cards = Remote.Failure(null)
    },
    getCardsLoading: (state) => {
      state.cards = Remote.Loading
    },
    getCardsSuccess: (state, action: PayloadAction<Array<DebitCardType>>) => {
      state.cards = Remote.Success(action.payload)
    },
    getCurrentCardAccount: (state) => {},
    getCurrentCardAccountFailure: (state, action: PayloadAction<string>) => {
      state.currentCardAccount = Remote.Failure(action.payload)
    },
    getCurrentCardAccountLoading: (state) => {
      state.currentCardAccount = Remote.Loading
    },
    getCurrentCardAccountSuccess: (state, action: PayloadAction<AccountType>) => {
      state.currentCardAccount = Remote.Success(action.payload)
    },
    getEligibleAccounts: (state) => {},
    getEligibleAccountsFailure: (state, action: PayloadAction<string>) => {
      state.eligibleAccounts = Remote.Failure(action.payload)
    },
    getEligibleAccountsLoading: (state) => {
      state.eligibleAccounts = Remote.Loading
    },
    getEligibleAccountsSuccess: (state, action: PayloadAction<Array<AccountType>>) => {
      state.eligibleAccounts = Remote.Success(action.payload)
    },
    getLegalRequirements: () => {},
    getLegalRequirementsFailure: (state, action: PayloadAction<string>) => {
      state.legal = Remote.Failure(action.payload)
    },
    getLegalRequirementsLoading: (state) => {
      state.legal = Remote.Loading
    },
    getLegalRequirementsSuccess: (state, action: PayloadAction<Array<LegalRequirement>>) => {
      state.legal = Remote.Success(action.payload)
    },
    getProducts: () => {},
    getProductsFailure: (state) => {
      state.products = []
    },
    getProductsSuccess: (state, action: PayloadAction<Array<ProductType>>) => {
      state.products = action.payload
    },
    getResidentialAddress: () => {},
    getResidentialAddressFailure: (state, action: PayloadAction<string>) => {
      state.residentialAddress = Remote.Failure(action.payload)
    },
    getResidentialAddressLoading: (state) => {
      state.residentialAddress = Remote.Loading
    },
    getResidentialAddressSuccess: (state, action: PayloadAction<ResidentialAddress>) => {
      state.residentialAddress = Remote.Success(action.payload)
    },
    handleCardLock: (state, action: PayloadAction<CardActionType>) => {},
    handleCardLockFailure: (state, action: PayloadAction<string>) => {
      state.lockHandler = Remote.Failure(action.payload)
    },
    handleCardLockLoading: (state) => {
      state.lockHandler = Remote.Loading
    },
    handleCardLockSuccess: (state, action: PayloadAction<boolean>) => {
      state.lockHandler = Remote.Success(action.payload)
    },
    resetCreateCardState: (state) => {
      state.cardCreationData = Remote.NotAsked
      state.orderCardStep = OrderCardStep.RESIDENTIAL_ADDRESS
    },
    selectAccount: (state, action: PayloadAction<string>) => {},
    selectAccountFailure: (state, action: PayloadAction<string>) => {
      state.selectAccountHandler = Remote.Failure(action.payload)
    },
    selectAccountLoading: (state) => {
      state.selectAccountHandler = Remote.Loading
    },
    selectAccountSuccess: (state, action: PayloadAction<string>) => {
      state.selectAccountHandler = Remote.Success(action.payload)
    },
    setCardToken: (state, action: PayloadAction<string>) => {
      state.cardToken = action.payload
    },
    setCurrentCardSelected: (state, action: PayloadAction<DebitCardType>) => {
      state.currentCardSelected = action.payload
    },
    setOrderCardStep: (state, action: PayloadAction<OrderCardStep>) => {
      state.orderCardStep = action.payload
    },
    submitResidentialAddress: () => {},
    submitResidentialAddressFailure: (state, action: PayloadAction<string>) => {
      state.residentialAddress = Remote.Failure(action.payload)
    },
    submitResidentialAddressLoading: (state) => {
      state.residentialAddress = Remote.Loading
    },
    submitResidentialAddressSuccess: (state, action: PayloadAction<ResidentialAddress>) => {
      state.residentialAddress = Remote.Success(action.payload)
    },
    submitSocialSecurityNumber: () => {},
    terminateCard: (state, action: PayloadAction<string>) => {},
    terminateCardFailure: (state) => {
      state.terminateHandler = Remote.Failure(null)
    },
    terminateCardLoading: (state) => {
      state.terminateHandler = Remote.Loading
    },
    terminateCardSuccess: (state) => {
      state.terminateHandler = Remote.Success(null)
    },
    updateCurrentCard: (
      state,
      action: PayloadAction<{
        updatedCard: DebitCardType
        updatedCardsR: RemoteDataType<null, Array<DebitCardType>>
      }>
    ) => {
      state.currentCardSelected = action.payload.updatedCard
      state.cards = action.payload.updatedCardsR
    }
  }
})

const { actions } = debitCardSlice
const debitCardReducer = debitCardSlice.reducer
export { actions, debitCardReducer }
