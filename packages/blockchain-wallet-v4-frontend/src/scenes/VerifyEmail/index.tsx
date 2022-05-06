import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'

import VerifyEmail from './template'

class VerifyEmailContainer extends React.PureComponent<Props> {
  // to avoid react dev errors, set an initial state since we are using
  // getDerivedStateFromProps which will set a state from the component
  constructor(props) {
    super(props)
    this.state = {}
  }

  // When feature flag to create unified accounts is off
  // We don't want to direct the user to /select-product
  // rather take them straight to home screen of the wallet
  static getDerivedStateFromProps(nextProps) {
    if (nextProps.isEmailVerified) {
      if (nextProps.createExchangeUserFlag) {
        nextProps.routerActions.push('/select-product')
      } else {
        nextProps.routerActions.push('/home')
      }
    }
    return null
  }

  onResendEmail = () => {
    const { email, securityCenterActions } = this.props
    securityCenterActions.resendVerifyEmail(email, 'SIGN_UP')
  }

  skipVerification = () => {
    const { email } = this.props
    this.props.securityCenterActions.skipVerifyEmail(email)
    if (this.props.createExchangeUserFlag) {
      this.props.routerActions.push('/select-product')
    } else {
      this.props.routerActions.push('/home')
    }
  }

  render() {
    return <VerifyEmail {...this.props} resendEmail={this.onResendEmail} />
  }
}

const mapStateToProps = (state) => ({
  appEnv: selectors.core.walletOptions.getAppEnv(state).getOrElse('prod'),
  createExchangeUserFlag: selectors.core.walletOptions
    .getCreateExchangeUserOnSignupOrLogin(state)
    .getOrElse(false),
  email: selectors.signup.getRegisterEmail(state) as string,
  isEmailVerified: selectors.core.settings.getEmailVerified(state).getOrElse(false)
})

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  miscActions: bindActionCreators(actions.core.data.misc, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(VerifyEmailContainer)
