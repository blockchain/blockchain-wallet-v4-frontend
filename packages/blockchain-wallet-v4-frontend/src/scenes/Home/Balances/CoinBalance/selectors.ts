import { Remote } from 'blockchain-wallet-v4/src'
import * as lockboxBalanceSelectors from 'components/Balances/lockbox/selectors'
import * as balanceSelectors from 'components/Balances/selectors'

import { OwnProps } from '.'

export const getData = (state, ownProps: OwnProps) => {
  switch (ownProps.viewType) {
    case 'Wallet':
      return balanceSelectors.getBalanceSelector(ownProps.coin)(state)
    case 'Total':
      return balanceSelectors.getBalanceSelector(ownProps.coin)(state)
    case 'Hardware':
      switch (ownProps.coin) {
        case 'BTC':
          return lockboxBalanceSelectors.getLockboxBtcBalance(state)
        case 'BCH':
          return lockboxBalanceSelectors.getLockboxBchBalance(state)
        case 'ETH':
          return lockboxBalanceSelectors.getLockboxEthBalance(state)
        case 'XLM':
          return lockboxBalanceSelectors.getLockboxXlmBalance(state)
        default:
          return Remote.Failure('Unsupported Coin Code')
      }
  }
}
