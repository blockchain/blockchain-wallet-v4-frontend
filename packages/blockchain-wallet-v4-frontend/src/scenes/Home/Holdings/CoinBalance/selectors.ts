import { selectors } from 'data'

import { OwnProps } from '.'

export const getData = (state, ownProps: OwnProps) => {
  return selectors.balances.getCoinTotalBalance(ownProps.coin)(state)
}

export default getData
