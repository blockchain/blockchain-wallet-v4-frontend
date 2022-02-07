import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const sellOrder = selectors.components.buySell.getSellOrder(state)

  return {
    sellOrder
  }
}

export default getData
