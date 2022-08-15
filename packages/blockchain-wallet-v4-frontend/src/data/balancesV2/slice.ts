import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'

import { BalancesV2StateType } from './types'

const initialState: BalancesV2StateType = {
  unifiedBalances: Remote.NotAsked
}

const balancesV2Slice = createSlice({
  initialState,
  name: 'balancesV2',
  reducers: {
    getUnifiedBalances: () => {},
    getUnifiedBalancesFailure: () => {},
    getUnifiedBalancesLoading: () => {},
    getUnifiedBalancesSuccess: () => {},
    initializeSubscriptions: () => {},
    unsubscribe: (state, action: PayloadAction<string>) => {}
  }
})

const { actions } = balancesV2Slice
const balancesV2Reducer = balancesV2Slice.reducer
export { actions, balancesV2Reducer }
