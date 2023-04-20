import { lift } from 'ramda'
import { bindActionCreators } from 'redux'

import { ExtractSuccess, FiatType } from '@core/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { StakingWithdrawalFormType } from 'data/types'

import { emptyEarnBalanceObject, FORM_NAME } from './WithdrawalForm.model'
import { FormErrorsType } from './WithdrawalForm.types'

export const getActions = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  earnActions: bindActionCreators(actions.components.interest, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export const getData = (state) => {
  const coin = selectors.components.interest.getCoinType(state)
  const displayCoin = selectors.components.interest.getIsAmountDisplayedInCrypto(state)
  const formErrors = selectors.form.getFormSyncErrors(FORM_NAME)(state) as FormErrorsType
  const formValues = selectors.form.getFormValues(FORM_NAME)(state) as StakingWithdrawalFormType
  const walletCurrency: FiatType = selectors.core.settings.getCurrency(state).getOrElse('USD')

  return { coin, displayCoin, formErrors, formValues, walletCurrency }
}

export const getRemote = (state: RootState) => {
  const coin = selectors.components.interest.getCoinType(state)
  const accountBalancesR = selectors.components.interest.getStakingAccountBalance(state)
  const ratesR = selectors.components.interest.getRates(state)
  const buySellAccountBalancesR = selectors.components.buySell.getBSBalances(state)
  const stakingLimitsR = selectors.components.interest.getStakingLimits(state)

  return lift(
    (
      accountBalances: ExtractSuccess<typeof accountBalancesR>,
      buySellAccountBalances: ExtractSuccess<typeof buySellAccountBalancesR>,

      rates: ExtractSuccess<typeof ratesR>,
      stakingLimits: ExtractSuccess<typeof stakingLimitsR>
    ) => ({
      accountBalance: accountBalances[coin] || emptyEarnBalanceObject,
      buySellBalance: buySellAccountBalances[coin]?.available || '0',
      rates,
      stakingLimits
    })
  )(accountBalancesR, buySellAccountBalancesR, ratesR, stakingLimitsR)
}
