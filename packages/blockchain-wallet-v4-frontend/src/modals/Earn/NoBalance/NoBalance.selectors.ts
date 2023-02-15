import { lift } from 'ramda'
import { bindActionCreators } from 'redux'

import { ExtractSuccess } from '@core/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getActions = (dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export const getRemote = (state: RootState) => {
  const coin = selectors.components.interest.getCoinType(state)
  const buySellEligibilityR = selectors.components.buySell.getBSFiatEligible(state)

  return lift((buySellEligibility: ExtractSuccess<typeof buySellEligibilityR>) => ({
    coin,
    isBuySellEligible: buySellEligibility.eligible
  }))(buySellEligibilityR)
}
