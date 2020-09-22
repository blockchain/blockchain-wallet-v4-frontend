import { RootState } from 'data/rootReducer'

export const getCoin = (state: RootState) => state.components.priceChart.coin

export const getTime = (state: RootState) => state.components.priceChart.time
