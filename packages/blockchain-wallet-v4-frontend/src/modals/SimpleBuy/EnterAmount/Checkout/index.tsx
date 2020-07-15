import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import {
  OwnProps as EnterAmountOwnProps,
  SuccessStateType as EnterAmountSuccessStateType
} from '../index'
import { getData } from './selectors'
import { RootState } from 'data/rootReducer'
import { SBCheckoutFormValuesType, UserDataType } from 'data/types'
import { SBPaymentMethodType } from 'core/types'
import Failure from '../template.failure'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

class Checkout extends PureComponent<Props> {
  componentDidMount () {
    this.props.simpleBuyActions.initializeCheckout(
      this.props.paymentMethods,
      this.props.cards,
      'BUY'
    )
  }

  handleSubmit = () => {
    // if the user is < tier 2 go to kyc but save order info
    // if the user is tier 2 try to submit order, let BE fail
    const { formValues, userData } = this.props.data.getOrElse({
      formValues: {
        method: { limits: { min: '0', max: '0' }, type: 'BANK_ACCOUNT' }
      } as SBCheckoutFormValuesType,
      userData: { tiers: { current: 0, next: 0, selected: 0 } } as UserDataType
    } as SuccessStateType)

    if (userData.tiers.current < 2) {
      this.props.identityVerificationActions.verifyIdentity(
        2,
        false,
        'SBEnterAmountCheckout'
      )
      this.props.simpleBuyActions.createSBOrder(
        undefined,
        formValues?.method?.type as SBPaymentMethodType['type']
      )
    } else if (formValues && formValues.method) {
      switch (formValues.method.type) {
        case 'PAYMENT_CARD':
          this.props.simpleBuyActions.setStep({
            step: 'ADD_CARD'
          })
          break
        case 'USER_CARD':
          this.props.simpleBuyActions.createSBOrder(formValues.method.id)
          break
        case 'BANK_ACCOUNT':
          this.props.simpleBuyActions.createSBOrder()
          break
        case 'FUNDS':
          // eslint-disable-next-line
          console.log('Payment method type not supported.')
      }
    }
  }

  render () {
    return this.props.data.cata({
      Success: val => (
        <Success {...this.props} {...val} onSubmit={this.handleSubmit} />
      ),
      Failure: () => (
        <Failure
          fiatCurrency={this.props.fiatCurrency}
          simpleBuyActions={this.props.simpleBuyActions}
          formActions={this.props.formActions}
          analyticsActions={this.props.analyticsActions}
        />
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state)
})

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  formActions: bindActionCreators(actions.form, dispatch),
  profileActions: bindActionCreators(actions.modules.profile, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = EnterAmountOwnProps & EnterAmountSuccessStateType
export type SuccessStateType = ReturnType<typeof getData>['data'] & {
  formErrors: { amount?: 'ABOVE_MAX' | 'BELOW_MIN' | boolean }
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Checkout)
