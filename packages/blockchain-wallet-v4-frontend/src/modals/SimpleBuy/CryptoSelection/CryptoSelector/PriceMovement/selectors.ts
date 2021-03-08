import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { lift } from 'ramda'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { OwnProps } from '.'

export const getData = (state: RootState, ownProps: OwnProps) => {
  const coin = ownProps.coin
  const price24HrR = selectors.core.data.misc.getPriceChange(coin, 'day', state)

  return lift((price24Hr: ExtractSuccess<typeof price24HrR>) => ({
    price24Hr
  }))(price24HrR)
}
