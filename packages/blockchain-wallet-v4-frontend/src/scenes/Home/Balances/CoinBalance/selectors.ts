import * as lockboxBalanceSelectors from 'components/Balances/lockbox/selectors'
import * as totalBalanceSelectors from 'components/Balances/total/selectors'
import * as walletBalanceSelectors from 'components/Balances/wallet/selectors'
import { OwnProps } from '.'
import { Remote } from 'blockchain-wallet-v4/src'

export const getData = (state, ownProps: OwnProps) => {
  switch (ownProps.viewType) {
    case 'Wallet':
      return walletBalanceSelectors.getBalanceSelector(ownProps.coin)(state)
    case 'Total':
      return totalBalanceSelectors.getBalanceSelector(ownProps.coin)(state)
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
