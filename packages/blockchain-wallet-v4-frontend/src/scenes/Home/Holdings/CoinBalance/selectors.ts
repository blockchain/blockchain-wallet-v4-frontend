import { selectors } from 'data'

export const getData = (state, coin: string) => {
  return selectors.balances.getCoinTotalBalance(coin)(state)
}

export default getData
