import { curry } from 'ramda'
import { createSelector } from 'reselect'

import { Remote } from '@core'
import { fiatToString } from '@core/exchange/utils'
import { FiatType } from '@core/types'
import { selectors } from 'data'

export const getData = curry((hash, currency: FiatType, state) => {
  return createSelector(
    [(state) => selectors.core.data.btc.getFiatAtTime(hash, currency)(state)],
    (fiatR) =>
      (fiatR || Remote.NotAsked).map((value) =>
        fiatToString({
          unit: currency,
          value
        })
      )
  )(state)
})
