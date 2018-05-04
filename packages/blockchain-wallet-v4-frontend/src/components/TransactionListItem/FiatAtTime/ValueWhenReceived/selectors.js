import { createSelector } from 'reselect'
import { curry } from 'ramda'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getData = curry((hash, currency, state) => createSelector(
  [state => selectors.core.data.bitcoin.getFiatAtTime(hash, currency)(state)],
  (fiatR) => (fiatR || Remote.NotAsked).map(x => Exchange.formatFiat(x, currency))
)(state))
