import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'

import { CardActionType, DebitCardState, DebitCardType, ProductType } from './types'

const initialState: DebitCardState = {
  cardCreationData: Remote.NotAsked,
  cardLock: Remote.NotAsked,
  cardToken: '',
  cards: [],
  products: []
}

const debitCardSlice = createSlice({
  initialState,
  name: 'debitCard',
  reducers: {
    cleanCardToken: (state) => {
      state.cardToken = ''
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
    getCards: () => {},
    getCardsFailure: (state) => {
      state.cards = []
    },
    getCardsSuccess: (state, action: PayloadAction<Array<DebitCardType>>) => {
      state.cards = action.payload
    },
    getProducts: () => {},
    getProductsFailure: (state) => {
      state.products = []
    },
    getProductsSuccess: (state, action: PayloadAction<Array<ProductType>>) => {
      state.products = action.payload
    },
    handleCardLock: (state, action: PayloadAction<CardActionType>) => {},
    handleCardLockFailure: (state, action: PayloadAction<string>) => {
      state.cardLock = Remote.Failure(action.payload)
    },
    handleCardLockLoading: (state) => {
      state.cardLock = Remote.Loading
    },
    handleCardLockSuccess: (state, action: PayloadAction<boolean>) => {
      state.cardLock = Remote.Success(action.payload)
    },
    resetCreateCardState: (state) => {
      state.cardCreationData = Remote.NotAsked
    },
    setCardToken: (state, action: PayloadAction<string>) => {
      state.cardToken = action.payload
    },
    terminateCard: (state, action: PayloadAction<string>) => {}
  }
})

const { actions } = debitCardSlice
const debitCardReducer = debitCardSlice.reducer
export { actions, debitCardReducer }
