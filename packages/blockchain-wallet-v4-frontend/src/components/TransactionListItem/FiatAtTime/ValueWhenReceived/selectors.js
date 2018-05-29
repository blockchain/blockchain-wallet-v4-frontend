import { createSelector } from 'reselect'
import { curry } from 'ramda'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { selectors } from 'data'

export const getData = curry((hash, currency, state) => createSelector(
  [state => selectors.core.data.bitcoin.getFiatAtTime(hash, currency)(state)],
  (fiatR) => (fiatR || Remote.NotAsked).map(value => Currency.fiatToString({ value, unit: { currency, symbol: Exchange.getSymbol(currency) } }))
)(state))
