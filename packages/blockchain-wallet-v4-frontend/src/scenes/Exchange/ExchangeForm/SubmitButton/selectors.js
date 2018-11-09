import { Remote } from 'blockchain-wallet-v4'
import { createSelector } from 'reselect'
import { getCurrentPairAmounts } from '../selectors'

export const getData = createSelector(
  (state, ownProps) =>
    !Remote.Success.is(getCurrentPairAmounts(state, ownProps)),
  disabled => ({ disabled })
)
