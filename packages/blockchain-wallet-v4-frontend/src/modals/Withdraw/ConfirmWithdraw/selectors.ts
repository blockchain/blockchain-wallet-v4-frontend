import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { OwnProps } from '.'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState, ownProps: OwnProps) => {
  const feesR = selectors.components.withdraw.getFeeForCurrency(
    state,
    ownProps.fiatCurrency
  )

  return lift((fees: ExtractSuccess<typeof feesR>) => ({
    fees
  }))(feesR)
}
