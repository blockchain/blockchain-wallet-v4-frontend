import { selectors } from 'data'
import { sequence, reduce, add } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'

export const getData = (state) => {
  const settings = [
    selectors.core.settings.getEmailVerified(state),
    selectors.core.wallet.isMnemonicVerified(state) ? Remote.of(1) : Remote.of(0),
    selectors.core.settings.getSmsVerified(state),
    selectors.core.settings.getHint(state) ? Remote.of(1) : Remote.of(0),
    selectors.core.settings.getAuthType(state) > 0 ? Remote.of(1) : Remote.of(0),
    selectors.core.settings.getBlockTorIps(state)
  ]
  return sequence(Remote.of, settings).map(reduce(add, 0))
}
