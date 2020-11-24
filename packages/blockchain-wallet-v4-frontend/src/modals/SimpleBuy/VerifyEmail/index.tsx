import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from 'data/rootReducer'

// import {
//   CoinType,
//   SBOrderActionType,
//   SBOrderType,
//   SBPairType,
//   SBPaymentMethodType,
//   WalletFiatType
// } from 'core/types'
import { getData } from './selectors'
// import { GoalsType } from 'data/goals/types'
import { SBVerifyEmailFormValuesType } from 'data/types'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

class VerifyEmail extends PureComponent<Props> {
  componentDidMount () {
    const { isEmailVerified, settingsActions } = this.props
    if (!isEmailVerified) {
      settingsActions.fetchSettings()
    }
    this.props.simpleBuyActions.fetchSDDEligible()
  }

  componentDidUpdate (prevProps: Props) {
    if (
      prevProps.isEmailVerified !== this.props.isEmailVerified &&
      this.props.isEmailVerified &&
      this.props.cryptoCurrency &&
      this.props.fiatCurrency &&
      this.props.pair
    ) {
      this.props.simpleBuyActions.setStep({
        step: 'ENTER_AMOUNT',
        orderType: this.props.orderType,
        cryptoCurrency: this.props.cryptoCurrency,
        fiatCurrency: this.props.fiatCurrency,
        pair: this.props.pair
      })
    }
  }

  handleSubmit = () => {
    const {
      securityCenterActions,
      settingsActions,
      identityVerificationActions,
      formValues
    } = this.props
    if (formValues) {
      identityVerificationActions.updateEmail(formValues.email)
      securityCenterActions.resendVerifyEmail(formValues.email)
      settingsActions.setEmail(formValues.email)
    }
  }

  onResendEmail = (email: string) => {
    const { securityCenterActions } = this.props
    securityCenterActions.resendVerifyEmail(email)
  }

  render () {
    return this.props.data.cata({
      Success: val => (
        <Success
          {...this.props}
          {...val}
          resendEmail={this.onResendEmail}
          onSubmit={this.handleSubmit}
          initialValues={{
            email: val.email
          }}
        />
      ),
      Failure: () => null,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  isEmailVerified: selectors.core.settings
    .getEmailVerified(state)
    .getOrElse(false),
  formValues: selectors.form.getFormValues('sbChangeEmail')(state) as
    | SBVerifyEmailFormValuesType
    | undefined,
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state),
  cryptoCurrency: selectors.components.simpleBuy.getCryptoCurrency(state),
  orderType: selectors.components.simpleBuy.getOrderType(state),
  pair: selectors.components.simpleBuy.getSBPair(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  securityCenterActions: bindActionCreators(
    actions.modules.securityCenter,
    dispatch
  ),
  settingsActions: bindActionCreators(actions.core.settings, dispatch),
  profileActions: bindActionCreators(actions.modules.profile, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
}
export type Props = OwnProps & ConnectedProps<typeof connector>
export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export default connector(VerifyEmail)
