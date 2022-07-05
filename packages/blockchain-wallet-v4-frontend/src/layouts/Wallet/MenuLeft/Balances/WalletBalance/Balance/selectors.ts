import { selectors } from 'data'

export const getData = (state, ownProps) => {
  return selectors.balances.getCoinTotalBalance(ownProps.coin)(state)
}

export default getData
