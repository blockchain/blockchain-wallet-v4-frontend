import * as balanceSelectors from 'components/Balances/wallet/selectors'

export const getData = (state, ownProps) => {
  return balanceSelectors.getBalanceSelector(ownProps.coin)(state)
}
