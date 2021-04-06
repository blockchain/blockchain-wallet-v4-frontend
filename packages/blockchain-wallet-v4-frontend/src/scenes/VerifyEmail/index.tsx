import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, model, selectors } from 'data'

import VerifyEmail from './template'

const { DISMISS_VERIFICATION, EMAIL_VERIFIED } = model.analytics.AB_TEST_EVENTS

class VerifyEmailContainer extends React.PureComponent<PropsType, {}> {
  state = {}

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.isEmailVerified) {
      nextProps.authActions.setRegisterEmail(undefined)
      nextProps.routerActions.push('/home')
      nextProps.analyticsActions.logEvent(EMAIL_VERIFIED)
      // for first time login users we need to run goal since this is a first page we show them
      nextProps.runGoals()
    }
    return null
  }

  onResendEmail = () => {
    const { email, securityCenterActions } = this.props
    securityCenterActions.resendVerifyEmail(email)
  }

  skipVerification = () => {
    this.props.authActions.setRegisterEmail(undefined)
    this.props.analyticsActions.logEvent(DISMISS_VERIFICATION)
    this.props.routerActions.push('/home')
    // for first time login users we need to run goal since this is a first page we show them
    this.props.runGoals()
  }

  render() {
    return (
      <VerifyEmail
        {...this.props}
        resendEmail={this.onResendEmail}
        skipVerification={this.skipVerification}
      />
    )
  }
}

const mapStateToProps = state => ({
  email: selectors.auth.getRegisterEmail(state),
  appEnv: selectors.core.walletOptions.getAppEnv(state).getOrElse('prod'),
  isEmailVerified: selectors.core.settings
    .getEmailVerified(state)
    .getOrElse(false)
})

const mapDispatchToProps = dispatch => ({
  miscActions: bindActionCreators(actions.core.data.misc, dispatch),
  securityCenterActions: bindActionCreators(
    actions.modules.securityCenter,
    dispatch
  ),
  routerActions: bindActionCreators(actions.router, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch),
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  runGoals: () => dispatch(actions.goals.runGoals())
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type PropsType = ConnectedProps<typeof connector>

export default connector(VerifyEmailContainer)
