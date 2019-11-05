import * as balanceSelectors from 'components/Balances/wallet/selectors'
import { Remote } from 'blockchain-wallet-v4/src'

export const getData = (state, ownProps) => {
  switch (ownProps.coin) {
    case 'BTC':
      return balanceSelectors.getBtcBalance(state)
    case 'BCH':
      return balanceSelectors.getBchBalance(state)
    case 'ETH':
      return balanceSelectors.getEthBalance(state)
    case 'XLM':
      return balanceSelectors.getXlmBalance(state)
    case 'PAX':
      return balanceSelectors.getPaxBalance(state)
    default:
      return Remote.Failure('Unsupported Coin Code')
  }
}
