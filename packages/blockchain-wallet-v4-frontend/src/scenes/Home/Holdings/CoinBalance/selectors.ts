import * as balanceSelectors from 'components/Balances/selectors'

import { OwnProps } from '.'

export const getData = (state, ownProps: OwnProps) => {
  return balanceSelectors.getBalanceSelector(ownProps.coin)(state)
}
