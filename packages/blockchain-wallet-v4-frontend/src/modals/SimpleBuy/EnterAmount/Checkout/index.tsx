import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { find, isEmpty, pathOr, propEq, propOr } from 'ramda'
import { bindActionCreators } from 'redux'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions, selectors } from 'data'
import { getValidPaymentMethod } from 'data/components/simpleBuy/model'
import { RootState } from 'data/rootReducer'
import { SBCheckoutFormValuesType, UserDataType } from 'data/types'

import Loading from '../../template.loading'
import {
  OwnProps as EnterAmountOwnProps,
  SuccessStateType as EnterAmountSuccessStateType
} from '../index'
import Failure from '../template.failure'
import { getData } from './selectors'
import Success from './template.success'

class Checkout extends PureComponent<Props> {
  componentDidMount() {
    const dataGoal = find(propEq('name', 'simpleBuy'), this.props.goals)
    const goalAmount = pathOr('', ['data', 'amount'], dataGoal)
    const amount = goalAmount || this.props.formValues?.amount
    const cryptoAmount = this.props.formValues?.cryptoAmount

    this.props.simpleBuyActions.initializeCheckout(
      this.props.pairs,
      this.props.orderType,
      this.props.preferences[this.props.orderType].fix,
      this.props.pair,
      amount,
      this.props.swapAccount,
      cryptoAmount
    )

    if (!Remote.Success.is(this.props.data)) {
      this.props.simpleBuyActions.fetchSDDEligible()
      this.props.simpleBuyActions.fetchSBCards()
      this.props.brokerageActions.fetchBankTransferAccounts()
      this.props.simpleBuyActions.fetchLimits(this.props.fiatCurrency || 'USD')
    }
  }

  handleSubmit = () => {
    // if the user is < tier 2 go to kyc but save order info
    // if the user is tier 2 try to submit order, let BE fail
    const { formValues } = this.props
    const {
      hasPaymentAccount,
      isSddFlow,
      userData
    } = this.props.data.getOrElse({
      userData: { tiers: { current: 0, next: 0, selected: 0 } } as UserDataType,
      hasPaymentAccount: false,
      isSddFlow: false
    } as SuccessStateType)
    const simpleBuyGoal = find(propEq('name', 'simpleBuy'), this.props.goals)
    const id = propOr('', 'id', simpleBuyGoal)

    !isEmpty(id) && this.props.deleteGoal(String(id))
    const method = this.props.method || this.props.defaultMethod

    // TODO: sell
    // need to do kyc check
    if (formValues?.orderType === 'SELL') {
      return this.props.simpleBuyActions.setStep({
        step: 'PREVIEW_SELL',
        sellOrderType: this.props.swapAccount?.type
      })
    }

    if (isSddFlow) {
      const currentTier = userData?.tiers?.current
      if (currentTier === 2 || currentTier === 1) {
        // user in SDD but already completed eligibility check, continue to payment
        this.props.simpleBuyActions.createSBOrder('PAYMENT_CARD')
      } else {
        // user in SDD but needs to confirm KYC and SDD eligibility
        this.props.identityVerificationActions.verifyIdentity(
          2,
          false,
          true,
          () => this.props.simpleBuyActions.createSBOrder('PAYMENT_CARD')
        )
      }
    } else if (!method) {
      const fiatCurrency = this.props.fiatCurrency || 'USD'
      const nextStep = hasPaymentAccount
        ? 'LINKED_PAYMENT_ACCOUNTS'
        : 'PAYMENT_METHODS'
      this.props.simpleBuyActions.setStep({
        step: nextStep,
        fiatCurrency,
        pair: this.props.pair,
        cryptoCurrency: this.props.cryptoCurrency,
        order: this.props.order
      })
    } else if (userData.tiers.current < 2) {
      this.props.simpleBuyActions.createSBOrder(
        getValidPaymentMethod(method.type)
      )
    } else if (formValues && method) {
      switch (method.type) {
        case 'PAYMENT_CARD':
          this.props.simpleBuyActions.setStep({
            step: 'ADD_CARD'
          })
          break
        case 'USER_CARD':
          this.props.simpleBuyActions.createSBOrder('PAYMENT_CARD', method.id)
          break
        case 'FUNDS':
          this.props.simpleBuyActions.createSBOrder('FUNDS')
          break
        case 'BANK_TRANSFER':
          this.props.simpleBuyActions.createSBOrder('BANK_TRANSFER', method.id)
          break
        case 'BANK_ACCOUNT':
          break
        default:
          break
      }
    }
  }

  render() {
    return this.props.data.cata({
      Success: val => (
        <Success {...this.props} {...val} onSubmit={this.handleSubmit} />
      ),
      Failure: () => (
        <Failure
          fiatCurrency={this.props.fiatCurrency}
          simpleBuyActions={this.props.simpleBuyActions}
        />
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  data: getData(state, ownProps),
  cryptoCurrency:
    selectors.components.simpleBuy.getCryptoCurrency(state) || 'BTC',
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state),
  formValues: selectors.form.getFormValues('simpleBuyCheckout')(state) as
    | SBCheckoutFormValuesType
    | undefined,
  goals: selectors.goals.getGoals(state),
  preferences: selectors.preferences.getSBCheckoutPreferences(state),
  sbOrders: selectors.components.simpleBuy.getSBOrders(state).getOrElse([])
})

const mapDispatchToProps = dispatch => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  deleteGoal: (id: string) => dispatch(actions.goals.deleteGoal(id)),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  profileActions: bindActionCreators(actions.modules.profile, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = EnterAmountOwnProps & EnterAmountSuccessStateType
export type SuccessStateType = ReturnType<typeof getData>['data'] & {
  formErrors: { amount?: 'ABOVE_MAX' | 'BELOW_MIN' | boolean }
  hasPaymentAccount: boolean
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Checkout)
