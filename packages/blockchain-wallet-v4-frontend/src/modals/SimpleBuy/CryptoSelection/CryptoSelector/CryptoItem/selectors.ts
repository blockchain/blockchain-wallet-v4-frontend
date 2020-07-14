import { ExtractSuccess } from 'core/types'
import { getCoinFromPair } from 'data/components/simpleBuy/model'
import { getRatesSelector } from 'core/redux/data/misc/selectors'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'

import { OwnProps } from '.'

export const getData = (state: RootState, ownProps: OwnProps) => {
  const coin = getCoinFromPair(ownProps.value.pair)
  const ratesR = getRatesSelector(coin, state)

  return lift((rates: ExtractSuccess<typeof ratesR>) => ({ rates }))(ratesR)
}
