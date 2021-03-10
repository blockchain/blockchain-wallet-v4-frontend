import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { lift } from 'ramda'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { OwnProps } from '.'

export const getData = (state: RootState, ownProps: OwnProps) => {
  const feesR = selectors.components.withdraw.getFeeForCurrency(
    state,
    ownProps.fiatCurrency
  )

  return lift((fees: ExtractSuccess<typeof feesR>) => ({
    fees
  }))(feesR)
}
