import { createSlice } from '@reduxjs/toolkit'

import { GoalsState } from './types'

const initialState: GoalsState = {
  goals: [],
  initialModalDisplayed: false,
  initialModals: {},
  initialRedirect: ''
}

const goalsSlice = createSlice({
  initialState,
  name: 'goals',
  reducers: {
    addInitialModal: () => {},
    addInitialRedirect: () => {},
    deleteGoal: () => {},
    initialModalDisplayed: () => {},
    saveGoal: () => {}
  }
})
