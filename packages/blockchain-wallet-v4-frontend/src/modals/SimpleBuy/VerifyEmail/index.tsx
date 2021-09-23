import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { actions, model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { SBVerifyEmailFormValuesType } from 'data/types'

import Loading from '../template.loading'
import { getData } from './selectors'
import Success from './template.success'

const { SB_CHANGE_EMAIL_FORM } = model.components.simpleBuy

class VerifyEmail extends PureComponent<Props> {
  componentDidMount() {
    this.props.buySellActions.fetchSDDEligibility()
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.isEmailVerified !== this.props.isEmailVerified &&
      this.props.isEmailVerified &&
      this.props.cryptoCurrency &&
      this.props.fiatCurrency &&
      this.props.pair
    ) {
      this.props.buySellActions.setStep({
        cryptoCurrency: this.props.cryptoCurrency,
        fiatCurrency: this.props.fiatCurrency,
        orderType: this.props.orderType,
        pair: this.props.pair,
        step: 'ENTER_AMOUNT'
      })
    }
  }

  handleSubmit = () => {
    const { formValues, identityVerificationActions, securityCenterActions, settingsActions } =
      this.props
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

  render() {
    return this.props.data.cata({
      Failure: () => null,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => (
        <Success
          {...this.props}
          {...val}
          resendEmail={this.onResendEmail}
          onSubmit={this.handleSubmit}
          initialValues={{
            email: val.email
          }}
        />
      )
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  cryptoCurrency: selectors.components.simpleBuy.getCryptoCurrency(state),
  data: getData(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state),
  formValues: selectors.form.getFormValues(SB_CHANGE_EMAIL_FORM)(state) as
    | SBVerifyEmailFormValuesType
    | undefined,
  isEmailVerified: selectors.core.settings.getEmailVerified(state).getOrElse(false),
  orderType: selectors.components.simpleBuy.getOrderType(state),
  pair: selectors.components.simpleBuy.getSBPair(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  profileActions: bindActionCreators(actions.modules.profile, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
}
export type Props = OwnProps & ConnectedProps<typeof connector>
export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export default connector(VerifyEmail)
