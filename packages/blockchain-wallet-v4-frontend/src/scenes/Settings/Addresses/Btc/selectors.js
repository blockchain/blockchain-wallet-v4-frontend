import { Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getData = state => {
  return Remote.of(selectors.core.wallet.getWalletContext(state)).getOrElse('')
}
