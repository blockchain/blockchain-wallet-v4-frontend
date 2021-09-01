import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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

type SaveGoalPayload = {
  data
  name: GoalsType
}

const generateId = () => Math.random().toString(36).substr(2, 10)

const goalsSlice = createSlice({
  initialState,
  name: 'goals',
  reducers: {
    addInitialModal: (state, action: PayloadAction<AddInitialModalPayload>) => {
      state.initialModals[action.payload.key] = action.payload
    },
    addInitialRedirect: (state, action: PayloadAction<string>) => {
      state.initialRedirect = action.payload
    },
    defineGoals: () => {},
    deleteGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter((goal) => goal.id !== action.payload)
    },
    initialModalDisplayed: (state) => {
      state.initialModalDisplayed = true
    },
    runGoals: () => {},
    saveGoal: (state, action: PayloadAction<SaveGoalPayload>) => {
      state.goals.push({ id: generateId(), ...action.payload })
    }
  }
})

export const { actions } = goalsSlice
export const goalsReducer = goalsSlice.reducer
