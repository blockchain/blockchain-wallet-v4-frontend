import { lift } from 'ramda'

import { ExtractSuccess, TimeRange } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { OwnProps } from '.'

export const getData = (state: RootState, ownProps: OwnProps) => {
  const priceChangeR = selectors.core.data.misc.getPriceChange(ownProps.coin, TimeRange.DAY, state)

  return lift((priceChange: ExtractSuccess<typeof priceChangeR>) => ({
    priceChange
  }))(priceChangeR)
}

export default getData
