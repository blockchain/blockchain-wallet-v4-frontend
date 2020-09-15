import { RootState } from 'data/rootReducer'

export const getPayment = (state: RootState) => state.transferEth.payment
