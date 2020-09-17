import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'

import { OwnProps } from '.'
import { selectors } from 'data'

export const getData = (state: RootState, ownProps: OwnProps) => {
  const priceChangeR = selectors.core.data.misc.getPriceChange(
    ownProps.coin,
    'day',
    state
  )

  return lift((priceChange: ExtractSuccess<typeof priceChangeR>) => ({
    priceChange
  }))(priceChangeR)
}
