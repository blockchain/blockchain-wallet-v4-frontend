import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { merge } from 'ramda'

import {
  ModalNameType,
  ModalParamPropsType,
  ModalsState,
  UpdateModalOptionsPayload,
  UpdateModalPayload
} from './types'

const initialState: ModalsState = []

const modalsSlice = createSlice({
  initialState,
  name: 'modals',
  reducers: {
    closeAllModals: () => {
      return initialState
    },
    closeModal: {
      prepare: (modalName?: ModalNameType) => {
        return { payload: { modalName } }
      },
      reducer: (state, action: PayloadAction<{ modalName?: ModalNameType }>) => {
        if (action.payload.modalName) {
          return state.filter((modal) => modal.type !== action.payload.modalName)
        }
        // remove last
        const lastIndex = state.length - 1
        state.splice(lastIndex, 1)
      }
    },
    showModal: {
      prepare: (type: ModalNameType, props: ModalParamPropsType, options = {}) => {
        return { payload: { options, props, type } }
      },
      reducer: (state, action: PayloadAction<UpdateModalPayload>) => {
        const nextIndex = state.length
        const { options = {}, type, props } = action.payload
        if (state.filter((x) => x.type === type).length === 0) {
          state[nextIndex] = { options, props, type }
        }
      }
    },

    updateModalOptions: {
      prepare: (options = {}) => {
        return { payload: { options } }
      },
      reducer: (state, action: PayloadAction<UpdateModalOptionsPayload>) => {
        const { options = {} } = action.payload
        const lastIndex = state.length - 1
        const lastModal = state[lastIndex]
        const updatedModal = merge(lastModal, options)
        state[lastIndex] = updatedModal
      }
    }
  }
})

export const { actions } = modalsSlice
export const modalReducer = modalsSlice.reducer
