import * as balanceSelectors from 'components/Balances/wallet/selectors'

export const getData = (state, ownProps) => {
  switch (ownProps.coin) {
    case 'BTC':
      return balanceSelectors.getBtcBalance(state)
    case 'BCH':
      return balanceSelectors.getBchBalance(state)
    case 'BSV':
      return balanceSelectors.getBsvBalance(state)
    case 'ETH':
      return balanceSelectors.getEthBalance(state)
    case 'XLM':
      return balanceSelectors.getXlmBalance(state)
    default:
      // fallback to erc20
      return null
  }
}
