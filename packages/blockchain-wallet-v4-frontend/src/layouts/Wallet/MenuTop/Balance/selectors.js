import { Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import { lift } from 'ramda'

export const getData = (state) => {
  const ethContextR = selectors.core.kvStore.ethereum.getContext(state)
  const btcContextR = Remote.of(selectors.core.wallet.getSpendableContext(state))
  const bchContextR = Remote.of(selectors.core.kvStore.bch.getSpendableContext(state))
  const btcUnspendableContextR = Remote.of(selectors.core.wallet.getUnspendableContext(state))
  const bchUnspendableContextR = Remote.of(selectors.core.kvStore.bch.getUnspendableContext(state))
  const path = state.router.location.pathname

  const transform = lift((btcContext, ethContext, bchContext, btcUnspendableContext, bchUnspendableContext) => {
    return {btcContext, ethContext, bchContext, btcUnspendableContext, bchUnspendableContext, path}
  })
  return transform(btcContextR, ethContextR, bchContextR, btcUnspendableContextR, bchUnspendableContextR)
}
