import { curry } from 'ramda'
import { createSelector } from 'reselect'

import { Remote } from 'blockchain-wallet-v4/src'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/utils'
import { FiatType } from 'blockchain-wallet-v4/src/types'
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
