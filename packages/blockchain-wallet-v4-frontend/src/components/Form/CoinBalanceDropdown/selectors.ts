import { OwnProps } from '.'
import { selectors } from 'data'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

export const getData = (state, ownProps?: OwnProps) => {
  if (!ownProps) return Remote.Success([])

  switch (ownProps.coin) {
    case 'BCH':
      return selectors.core.common.bch.getAccountsBalances(state)
    case 'BTC':
      return selectors.core.common.btc.getActiveAccountsBalances(state)
    case 'ETH':
      return selectors.core.common.eth.getAccountBalances(state)
    case 'PAX':
    case 'USDT':
      return selectors.core.common.eth.getErc20AccountBalances(
        state,
        ownProps.coin
      )
    case 'XLM':
      return selectors.core.common.xlm.getAccountBalances(state)
    default:
      return Remote.Success([])
  }
}
