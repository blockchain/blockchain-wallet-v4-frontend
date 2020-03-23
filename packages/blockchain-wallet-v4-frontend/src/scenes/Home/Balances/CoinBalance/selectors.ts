import * as lockboxBalanceSelectors from 'components/Balances/lockbox/selectors'
import * as totalBalanceSelectors from 'components/Balances/total/selectors'
import * as walletBalanceSelectors from 'components/Balances/wallet/selectors'
import { OwnProps } from '.'
import { Remote } from 'blockchain-wallet-v4/src'

export const getData = (state, ownProps: OwnProps) => {
  switch (ownProps.viewType) {
    case 'Wallet':
      switch (ownProps.coin) {
        case 'BTC':
          return walletBalanceSelectors.getBtcBalance(state)
        case 'BCH':
          return walletBalanceSelectors.getBchBalance(state)
        case 'ETH':
          return walletBalanceSelectors.getEthBalance(state)
        case 'XLM':
          return walletBalanceSelectors.getXlmBalance(state)
        case 'PAX':
          return walletBalanceSelectors.getPaxBalance(state)
        default:
          return Remote.Failure('Unsupported Coin Code')
      }
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
    default:
      switch (ownProps.coin) {
        case 'BTC':
          return totalBalanceSelectors.getBtcBalance(state)
        case 'BCH':
          return totalBalanceSelectors.getBchBalance(state)
        case 'ETH':
          return totalBalanceSelectors.getEthBalance(state)
        case 'XLM':
          return totalBalanceSelectors.getXlmBalance(state)
        case 'PAX':
          return totalBalanceSelectors.getPaxBalance(state)
        default:
          return Remote.Failure('Unsupported Coin Code')
      }
  }
}
