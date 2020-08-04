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
import Failure from '../template.failure'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

class Checkout extends PureComponent<Props> {
  componentDidMount () {
    const amount = this.props.formValues?.amount
    this.props.simpleBuyActions.initializeCheckout(
      this.props.pairs,
      'BUY',
      this.props.pair,
      amount
    )
  }

  handleSubmit = () => {
    // if the user is < tier 2 go to kyc but save order info
    // if the user is tier 2 try to submit order, let BE fail
    const { formValues } = this.props
    const { userData } = this.props.data.getOrElse({
      userData: { tiers: { current: 0, next: 0, selected: 0 } } as UserDataType
    } as SuccessStateType)

    const method = this.props.method || this.props.defaultMethod

    if (userData.tiers.current < 2) {
      this.props.simpleBuyActions.createSBOrder(undefined, method?.type)
    } else if (!method) {
      const fiatCurrency = this.props.fiatCurrency || 'USD'
      this.props.simpleBuyActions.setStep({
        step: 'PAYMENT_METHODS',
        fiatCurrency,
        pair: this.props.pair,
        cryptoCurrency: this.props.cryptoCurrency,
        order: this.props.order
      })
    } else if (formValues && method) {
      switch (method.type) {
        case 'PAYMENT_CARD':
          this.props.simpleBuyActions.setStep({
            step: 'ADD_CARD'
          })
          break
        case 'USER_CARD':
          this.props.simpleBuyActions.createSBOrder(method.id)
          break
        case 'FUNDS':
        case 'BANK_ACCOUNT':
          this.props.simpleBuyActions.createSBOrder(undefined, method.type)
          break
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
  cryptoCurrency:
    selectors.components.simpleBuy.getCryptoCurrency(state) || 'BTC',
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state),
  formValues: selectors.form.getFormValues('simpleBuyCheckout')(state) as
    | SBCheckoutFormValuesType
    | undefined
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
