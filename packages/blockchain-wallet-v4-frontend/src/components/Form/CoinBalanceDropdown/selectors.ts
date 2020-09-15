import { OwnProps } from '.'
import { selectors } from 'data'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

export const getData = (state, ownProps?: OwnProps) => {
  if (!ownProps) return Remote.Success([])

  switch (ownProps.coin) {
    case 'BTC':
      return selectors.core.common.btc.getActiveAccountsBalances(state)
    case 'ETH':
      return selectors.core.common.eth.getAccountBalances(state)
    case 'PAX':
      return selectors.core.common.eth.getErc20AccountBalances(state, 'PAX')
    case 'USDT':
      return selectors.core.common.eth.getErc20AccountBalances(state, 'USDT')
    default:
      return Remote.Success([])
  }
}
