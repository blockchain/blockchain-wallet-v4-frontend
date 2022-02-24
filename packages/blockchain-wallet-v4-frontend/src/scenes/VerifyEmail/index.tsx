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

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.isEmailVerified) {
      nextProps.authActions.setRegisterEmail(undefined)
      nextProps.routerActions.push('/product-picker')
    }
    return null
  }

  onResendEmail = () => {
    const { email, securityCenterActions } = this.props
    securityCenterActions.resendVerifyEmail(email)
  }

  skipVerification = () => {
    const { email } = this.props
    this.props.authActions.setRegisterEmail(undefined)
    this.props.securityCenterActions.skipVerifyEmail(email)
    this.props.routerActions.push('/product-picker')
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

const mapStateToProps = (state) => ({
  appEnv: selectors.core.walletOptions.getAppEnv(state).getOrElse('prod'),
  email: selectors.auth.getRegisterEmail(state) as string,
  isEmailVerified: selectors.core.settings.getEmailVerified(state).getOrElse(false)
})

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  miscActions: bindActionCreators(actions.core.data.misc, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch),
  runGoals: () => dispatch(actions.goals.runGoals()),
  saveGoal: (name, data) => dispatch(actions.goals.saveGoal({ data, name })),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(VerifyEmailContainer)
