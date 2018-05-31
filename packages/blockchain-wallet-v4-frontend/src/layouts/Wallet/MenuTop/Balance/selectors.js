import { Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import { filter, reject, prop, lift } from 'ramda'

export const getData = (state) => {
  const ethContextR = selectors.core.kvStore.ethereum.getContext(state)
  const bchContextR = Remote.of(selectors.core.kvStore.bch.getContext(state))
  const btcActiveAccountsR = selectors.core.common.btc.getActiveHDAccounts(state)
  const btcActiveAddressesR = selectors.core.common.btc.getActiveAddresses(state)
  const path = state.router.location.pathname

  const transform = lift((btcActiveAddresses, btcActiveAccounts, ethContext, bchContext) => {
    const spendable = (a) => a.priv
    const accounts = btcActiveAccounts.map(prop('xpub'))
    const btcUnspendableContext = reject(spendable, btcActiveAddresses).map(prop('addr'))
    const btcSpendableContext = filter(spendable, btcActiveAddresses).map(prop('addr')).concat(accounts)
    return {btcSpendableContext, btcUnspendableContext, ethContext, bchContext, path}
  })
  return transform(btcActiveAddressesR, btcActiveAccountsR, ethContextR, bchContextR)
}
