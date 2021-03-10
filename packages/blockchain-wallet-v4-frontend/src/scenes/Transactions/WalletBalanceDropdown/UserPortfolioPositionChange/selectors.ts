import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { lift } from 'ramda'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { OwnProps } from '.'

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
