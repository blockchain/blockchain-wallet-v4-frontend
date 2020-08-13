import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { OwnProps } from '.'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState, ownProps: OwnProps) => {
  const coin = ownProps.coin
  const price24HrR = selectors.core.data.misc.getPrice24H(coin, state)

  return lift((price24Hr: ExtractSuccess<typeof price24HrR>) => ({
    price24Hr
  }))(price24HrR)
}
