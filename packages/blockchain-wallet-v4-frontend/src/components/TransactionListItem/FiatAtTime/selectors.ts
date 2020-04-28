import { createSelector } from 'reselect'
import { curry } from 'ramda'
import { fiatToString } from 'core/exchange/currency'
import { FiatType } from 'core/types'
import { Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getData = curry((hash, currency: FiatType, state) => {
  return createSelector(
    [state => selectors.core.data.btc.getFiatAtTime(hash, currency)(state)],
    fiatR =>
      (fiatR || Remote.NotAsked).map(value =>
        fiatToString({
          value,
          unit: currency
        })
      )
  )(state)
})
