import { lift, pathOr, propOr } from 'ramda'
import { bindActionCreators } from 'redux'

import { EarnDepositErrorsType, ExtractSuccess, FiatType } from '@core/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { RewardsDepositFormType } from 'data/types'

import { FORM_NAME } from './DepositForm.model'
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
  const values = selectors.form.getFormValues(FORM_NAME)(state) as RewardsDepositFormType

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
  const earnEDDStatusR = selectors.components.interest.getEarnEDDStatus(state)
  const stakingRatesR = selectors.components.interest.getStakingRates(state)
  const paymentR = selectors.components.interest.getPayment(state)
  const stakingLimitsR = selectors.components.interest.getStakingLimits(state)

  return lift(
    (
      rates: ExtractSuccess<typeof ratesR>,
      stakingRates: ExtractSuccess<typeof stakingRatesR>,
      payment: ExtractSuccess<typeof paymentR>,
      stakingLimits: ExtractSuccess<typeof stakingLimitsR>,
      earnEDDStatus: ExtractSuccess<typeof earnEDDStatusR>
    ) => {
      const depositFee =
        coin === 'BCH' || coin === 'BTC'
          ? Number(pathOr('0', ['selection', 'fee'], payment))
          : Number(propOr('0', 'fee', payment))

      return {
        depositFee,
        earnEDDStatus,
        payment,
        rates,
        stakingLimits,
        stakingRates
      }
    }
  )(ratesR, stakingRatesR, paymentR, stakingLimitsR, earnEDDStatusR)
}
