import { RootState } from 'data/rootReducer'

export const getUnifiedBalances = (state: RootState) => state.balancesV2.unifiedBalances
