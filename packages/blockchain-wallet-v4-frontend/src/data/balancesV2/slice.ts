import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'
import { UnifiedBalancesResponseType } from '@core/network/api/coins/types'

import { BalancesV2StateType } from './types'

const initialState: BalancesV2StateType = {
  unifiedBalances: Remote.NotAsked
}

const balancesV2Slice = createSlice({
  initialState,
  name: 'balancesV2',
  reducers: {
    fetchUnifiedBalances: () => {},
    fetchUnifiedBalancesFailure: (state, action: PayloadAction<string>) => {
      state.unifiedBalances = Remote.Failure(action.payload)
    },
    fetchUnifiedBalancesLoading: (state) => {
      state.unifiedBalances = Remote.Loading
    },
    fetchUnifiedBalancesSuccess: (
      state,
      action: PayloadAction<UnifiedBalancesResponseType['currencies']>
    ) => {
      state.unifiedBalances = Remote.Success(action.payload)
    },
    initializeSubscriptions: () => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    unsubscribe: (state, action: PayloadAction<string>) => {}
  }
})

const { actions } = balancesV2Slice
const balancesV2Reducer = balancesV2Slice.reducer
export { actions, balancesV2Reducer }
