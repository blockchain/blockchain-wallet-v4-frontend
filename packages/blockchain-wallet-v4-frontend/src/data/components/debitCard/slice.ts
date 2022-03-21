import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'

import { DebitCardState, DebitCardType, ProductType } from './types'

const initialState: DebitCardState = {
  cardCreationData: Remote.NotAsked,
  cards: [],
  products: []
}

const debitCardSlice = createSlice({
  initialState,
  name: 'debitCard',
  reducers: {
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
    resetCreateCardState: (state) => {
      state.cardCreationData = Remote.NotAsked
    }
  }
})

const { actions } = debitCardSlice
const debitCardReducer = debitCardSlice.reducer
export { actions, debitCardReducer }
