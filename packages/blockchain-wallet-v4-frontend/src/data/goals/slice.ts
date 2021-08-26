import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { append, assoc, filter } from 'ramda'

import { ModalNameType, ModalParamPropsType } from 'data/modals/types'

import { GoalsState, GoalsType } from './types'

const initialState: GoalsState = {
  goals: [],
  initialModalDisplayed: false,
  initialModals: {},
  initialRedirect: ''
}

type AddInitialModalPayload = {
  data: ModalParamPropsType
  key: string
  name: ModalNameType
}

type AddInitialRedirectPayload = {
  path: string
}

type SaveGoalPayload = {
  data
  name: GoalsType
}

type DeleteGoalPayload = {
  id: string
}

const generateId = () => Math.random().toString(36).substr(2, 10)

const goalsSlice = createSlice({
  extraReducers: (builder) => {
    // Handle runGoals and defineGoals actions that does not change redux state
    builder.addDefaultCase((state) => state)
  },
  initialState,
  name: 'goals',
  reducers: {
    addInitialModal: {
      prepare: (
        key: AddInitialModalPayload['key'],
        name: AddInitialModalPayload['name'],
        data: AddInitialModalPayload['data']
      ) => {
        return { payload: { data, key, name } }
      },
      reducer: (state, action: PayloadAction<AddInitialModalPayload>) => {
        return {
          ...state,
          initialModals: {
            ...state.initialModals,
            [action.payload.key]: action.payload
          }
        }
      }
    },
    addInitialRedirect: {
      prepare: (path: AddInitialRedirectPayload['path']) => {
        return { payload: { path } }
      },
      reducer: (state, action: PayloadAction<AddInitialRedirectPayload>) => {
        return {
          ...state,
          initialRedirect: action.payload.path
        }
      }
    },
    deleteGoal: {
      prepare: (id: DeleteGoalPayload['id']) => {
        return { payload: { id } }
      },
      reducer: (state, action: PayloadAction<DeleteGoalPayload>) => {
        const { id } = action.payload
        return assoc(
          'goals',
          filter((a) => a.id !== id, state.goals),
          state
        )
      }
    },
    initialModalDisplayed: (state) => {
      return {
        ...state,
        initialModalDisplayed: true
      }
    },
    saveGoal: {
      prepare: (name: SaveGoalPayload['name'], data: SaveGoalPayload['data']) => {
        return { payload: { data, id: generateId(), name } }
      },
      reducer: (state, action: PayloadAction<SaveGoalPayload>) => {
        return assoc('goals', append(action.payload, state.goals), state)
      }
    }
  }
})

export const runGoals = createAction('goals/runGoals')

export const defineGoals = createAction('goals/defineGoals')

export const actions = { ...goalsSlice.actions, defineGoals, runGoals }

export const { addInitialModal, addInitialRedirect, deleteGoal, initialModalDisplayed, saveGoal } =
  actions

export const goalsReducer = goalsSlice.reducer
