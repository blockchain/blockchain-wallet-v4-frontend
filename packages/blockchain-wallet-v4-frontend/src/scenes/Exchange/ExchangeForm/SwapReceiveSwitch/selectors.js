import { createSelector } from 'reselect'

import { model } from 'data'

const { sourceActive, targetActive } = model.rates

export const getData = createSelector(
  (state, { fix }) => fix,
  fix => ({
    sourceActive: sourceActive(fix),
    targetActive: targetActive(fix)
  })
)
