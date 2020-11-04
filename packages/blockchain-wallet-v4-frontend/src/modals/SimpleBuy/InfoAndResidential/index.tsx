import { actions, model, selectors } from 'data'
import { bindActionCreators } from 'redux'
import {
  CoinType,
  ExtractSuccess,
  FiatType,
  RemoteDataType,
  SBOrderActionType,
  SBOrderType,
  SBPairType,
  SBPaymentMethodType
} from 'core/types'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import { RootState } from 'data/rootReducer'
import { SBInfoAndResidentialFormValuesType } from 'data/types'
import Failure from './template.failure'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

const { INFO_AND_RESIDENTIAL } = model.components.simpleBuy

class InfoAndResidential extends PureComponent<Props> {
  componentDidMount () {
    this.props.identityVerificationActions.fetchSupportedCountries()
  }

  handleSubmit = () => {
    // if the user is < tier 2 go to kyc but save order info
    // if the user is tier 2 try to submit order, let BE fail
    // const { formValues } = this.props
    // const { userData } = this.props.data.getOrElse({
    //   userData: { tiers: { current: 0, next: 0, selected: 0 } } as UserDataType
    // } as SuccessStateType)
    // const simpleBuyGoal = find(propEq('name', 'simpleBuy'), this.props.goals)
    // const id = propOr('', 'id', simpleBuyGoal)
    // !isEmpty(id) && this.props.deleteGoal(String(id))
    // const method = this.props.method || this.props.defaultMethod
    // console.log('method', method)
    // if (!this.props.isFirstLogin) {
    //   const fiatCurrency = this.props.fiatCurrency || 'USD'
    //   this.props.simpleBuyActions.setStep({
    //     step: 'INFO_AND_RESIDENTIAL',
    //     fiatCurrency,
    //     pair: this.props.pair,
    //     cryptoCurrency: this.props.cryptoCurrency,
    //     order: this.props.order
    //   })
    // } else if (!method) {
    //   const fiatCurrency = this.props.fiatCurrency || 'USD'
    //   this.props.simpleBuyActions.setStep({
    //     step: 'PAYMENT_METHODS',
    //     fiatCurrency,
    //     pair: this.props.pair,
    //     cryptoCurrency: this.props.cryptoCurrency,
    //     order: this.props.order
    //   })
    // } else if (userData.tiers.current < 2) {
    //   this.props.simpleBuyActions.createSBOrder(
    //     getValidPaymentMethod(method.type)
    //   )
    // } else if (formValues && method) {
    //   switch (method.type) {
    //     case 'PAYMENT_CARD':
    //       this.props.simpleBuyActions.setStep({
    //         step: 'ADD_CARD'
    //       })
    //       break
    //     case 'USER_CARD':
    //       this.props.simpleBuyActions.createSBOrder('PAYMENT_CARD', method.id)
    //       break
    //     case 'FUNDS':
    //       this.props.simpleBuyActions.createSBOrder('FUNDS')
    //       break
    //     case 'BANK_ACCOUNT':
    //       break
    //   }
    // }
    // console.log('form submit will be here')
    this.props.simpleBuyActions.saveInfoAndResidentialData()
    // jump to next step where we will check eligability
  }

  onCountryChange = (e, value) => {
    this.props.formActions.change(INFO_AND_RESIDENTIAL, 'country', value)
    this.props.formActions.clearFields(
      INFO_AND_RESIDENTIAL,
      false,
      false,
      'state'
    )
  }

  render () {
    return this.props.data.cata({
      Success: val => (
        <Success
          {...this.props}
          {...val}
          onSubmit={this.handleSubmit}
          onCountrySelect={this.onCountryChange}
        />
      ),
      Failure: () => (
        <Failure
          fiatCurrency={this.props.fiatCurrency || 'USD'}
          simpleBuyActions={this.props.simpleBuyActions}
          cryptoCurrency={this.props.cryptoCurrency}
          pair={this.props.pair}
        />
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  cryptoCurrency:
    selectors.components.simpleBuy.getCryptoCurrency(state) || 'BTC',
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state),
  formValues: selectors.form.getFormValues('simpleBuyCheckout')(state) as
    | SBInfoAndResidentialFormValuesType
    | undefined,
  goals: selectors.goals.getGoals(state),
  preferences: selectors.preferences.getSBCheckoutPreferences(state),
  isFirstLogin: selectors.auth.getFirstLogin(state),
  countryCode: selectors.core.settings.getCountryCode(state).getOrElse(null)
})

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  deleteGoal: (id: string) => dispatch(actions.goals.deleteGoal(id)),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  formActions: bindActionCreators(actions.form, dispatch),
  profileActions: bindActionCreators(actions.modules.profile, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
  method?: SBPaymentMethodType
  order?: SBOrderType
  orderType: SBOrderActionType
  pair: SBPairType
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type LinkStatePropsType = {
  cryptoCurrency: CoinType
  data: RemoteDataType<string, SuccessStateType>
  fiatCurrency: undefined | FiatType
  pair: SBPairType
}
export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(InfoAndResidential)
