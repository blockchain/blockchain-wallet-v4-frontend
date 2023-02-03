import { lift } from 'ramda'
import { createSelector } from 'reselect'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { getIsSddFlow } from 'data/components/buySell/selectors/getIsSddFlow'
import { RootState } from 'data/rootReducer'

import * as QuoteSummaryViewModel from './models/quoteSummaryViewModel'

const selectQuoteSummaryViewModel = createSelector(
  [selectors.components.buySell.getBuyQuoteMemoizedByOrder, selectors.core.data.coins.getCoins],
  (quoteR, coins) => quoteR.map((quoteState) => QuoteSummaryViewModel.make(quoteState, coins))
)

export const getData = (state: RootState) => {
  const bankAccountsR = selectors.components.brokerage.getBankTransferAccounts(state)

  const quoteSummaryViewModelR = selectQuoteSummaryViewModel(state)
  const sbBalancesR = selectors.components.buySell.getBSBalances(state)
  const cardsR = selectors.components.buySell.getBSCards(state)
  const isSddFlowR = getIsSddFlow(state)

  const withdrawLockCheckR = selectors.components.send.getWithdrawLockCheckRule(state)

  const orderR = selectors.components.buySell.getBSOrder(state)

  return lift(
    (
      bankAccounts: ExtractSuccess<typeof bankAccountsR>,
      quoteSummaryViewModel: ExtractSuccess<typeof quoteSummaryViewModelR>,
      sbBalances: ExtractSuccess<typeof sbBalancesR>,
      withdrawLockCheck: ExtractSuccess<typeof withdrawLockCheckR>,
      cards: ExtractSuccess<typeof cardsR>,
      order: ExtractSuccess<typeof orderR>,
      isSddFlow: ExtractSuccess<typeof isSddFlowR>
    ) => ({
      bankAccounts,
      cards,
      isSddFlow,
      order,
      quoteSummaryViewModel,
      sbBalances,
      withdrawLockCheck
    })
  )(
    bankAccountsR,
    quoteSummaryViewModelR,
    sbBalancesR,
    withdrawLockCheckR,
    cardsR,
    orderR,
    isSddFlowR
  )
}
