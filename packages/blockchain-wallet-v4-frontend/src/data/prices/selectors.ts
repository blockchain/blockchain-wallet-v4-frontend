import { RootState } from 'data/rootReducer'

// gets current prices for all coins
export const getAllCoinPrices = (state: RootState) => state.prices.current

// gets all coin prices 24 hours ago
export const getAllCoinPricesPreviousDay = (state: RootState) => state.prices.previousDay
