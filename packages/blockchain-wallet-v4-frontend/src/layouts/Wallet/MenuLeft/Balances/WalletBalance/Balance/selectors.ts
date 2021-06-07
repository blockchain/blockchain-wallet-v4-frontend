import * as balanceSelectors from 'components/Balances/selectors'

export const getData = (state, ownProps) => {
  return balanceSelectors.getBalanceSelector(ownProps.coin)(state)
}

export default getData
