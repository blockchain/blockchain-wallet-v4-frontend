import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import {
  CoinType,
  FiatType,
  RemoteDataType,
  SBSuggestedAmountType,
  SupportedCoinsType
} from 'core/types'
import { connect } from 'react-redux'
import {
  OwnProps as EnterAmountOwnProps,
  SuccessStateType as EnterAmountSuccessStateType
} from '../index'
import { getData } from './selectors'
import { RatesType, SBCheckoutFormValuesType, UserDataType } from 'data/types'
import { RootState } from 'data/rootReducer'
import Failure from '../template.failure'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

class Checkout extends PureComponent<Props> {
  componentDidMount () {
    this.props.simpleBuyActions.initializeCheckout(
      this.props.pairs,
      this.props.paymentMethods,
      'BUY'
    )
  }

  handleSubmit = () => {
    // if the user is < tier 2 go to kyc but save order info
    // if the user is tier 2 try to submit order, let BE fail
    const { formValues, userData } = this.props.data.getOrElse({
      formValues: {
        method: { limits: { min: '0', max: '0' }, type: 'BANK_TRANSFER' }
      } as SBCheckoutFormValuesType,
      userData: { tiers: { current: 0 } }
    })

    if (userData.tiers.current < 2) {
      this.props.identityVerificationActions.verifyIdentity(2)
    } else if (
      formValues &&
      formValues.method &&
      formValues.method.type === 'CARD'
    ) {
      // TODO: Simple Buy - select different cards?
      this.props.simpleBuyActions.setStep({
        step: 'ADD_CARD',
        cardId: undefined
      })
    } else {
      this.props.simpleBuyActions.createSBOrder()
    }
  }

  render () {
    return this.props.data.cata({
      Success: val => (
        <Success {...this.props} {...val} onSubmit={this.handleSubmit} />
      ),
      Failure: () => (
        <Failure
          simpleBuyActions={this.props.simpleBuyActions}
          formActions={this.props.formActions}
        />
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state)
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  profileActions: bindActionCreators(actions.modules.profile, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps
)

type OwnProps = EnterAmountOwnProps & EnterAmountSuccessStateType
export type SuccessStateType = {
  formErrors: { amount?: 'ABOVE_MAX' | 'BELOW_MIN' | boolean }
  formValues?: SBCheckoutFormValuesType
  rates: { [key in CoinType]: RatesType }
  suggestedAmounts: SBSuggestedAmountType
  supportedCoins: SupportedCoinsType
  userData: UserDataType
}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  fiatCurrency: undefined | FiatType
}
export type LinkDispatchPropsType = {
  formActions: typeof actions.form
  identityVerificationActions: typeof actions.components.identityVerification
  profileActions: typeof actions.modules.profile
  simpleBuyActions: typeof actions.components.simpleBuy
}
export type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

export default enhance(Checkout)
