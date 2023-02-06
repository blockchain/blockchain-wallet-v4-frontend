import { lift, pathOr, propOr } from 'ramda'
import { bindActionCreators } from 'redux'

import { EarnDepositErrorsType, ExtractSuccess, FiatType } from '@core/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ActiveRewardsDepositFormType } from 'data/types'

import { FORM_NAME } from './DepositForm.constants'
import { DataType } from './DepositForm.types'

export const getActions = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  earnActions: bindActionCreators(actions.components.interest, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export const getData = (state: RootState): DataType => {
  const walletCurrency: FiatType = selectors.core.settings.getCurrency(state).getOrElse('USD')
  const displayCoin = selectors.components.interest.getIsAmountDisplayedInCrypto(state)
  const earnDepositLimits = selectors.components.interest.getEarnDepositLimits(state)
  const formErrors = selectors.form.getFormSyncErrors(FORM_NAME)(state) as EarnDepositErrorsType
  const underSanctionsMessage = selectors.components.interest.getUnderSanctionsMessage(state)
  const values = selectors.form.getFormValues(FORM_NAME)(state) as ActiveRewardsDepositFormType

  return {
    displayCoin,
    earnDepositLimits,
    formErrors,
    underSanctionsMessage,
    values,
    walletCurrency
  }
}

export const getRemote = (state: RootState) => {
  const coin = selectors.components.interest.getCoinType(state)
  const ratesR = selectors.components.interest.getRates(state)
  const activeRewardsRatesR = selectors.components.interest.getActiveRewardsRates(state)
  const earnEDDStatusR = selectors.components.interest.getEarnEDDStatus(state)
  const paymentR = selectors.components.interest.getPayment(state)
  const isActiveRewardsWithdrawalEnabledR =
    selectors.core.walletOptions.getActiveRewardsWithdrawalEnabled(state)

  return lift(
    (
      activeRewardsRates: ExtractSuccess<typeof activeRewardsRatesR>,
      earnEDDStatus: ExtractSuccess<typeof earnEDDStatusR>,
      isActiveRewardsWithdrawalEnabled: boolean,
      payment: ExtractSuccess<typeof paymentR>,
      rates: ExtractSuccess<typeof ratesR>
    ) => {
      const depositFee =
        coin === 'BCH' || coin === 'BTC'
          ? Number(pathOr('0', ['selection', 'fee'], payment))
          : Number(propOr('0', 'fee', payment))
      return {
        activeRewardsRates,
        depositFee,
        earnEDDStatus,
        isActiveRewardsWithdrawalEnabled,
        payment,
        rates
      }
    }
  )(activeRewardsRatesR, earnEDDStatusR, isActiveRewardsWithdrawalEnabledR, paymentR, ratesR)
}
