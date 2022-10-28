import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Remote } from '@core'
import { actions, selectors } from 'data'
import { ProductSignupMetadata, SignupRedirectTypes } from 'data/types'

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
    const { createExchangeUserFlag, hasCowboyTag, isEmailVerified, signupCountry, signupMetadata } =
      nextProps
    const { signupRedirect } = signupMetadata
    if (isEmailVerified) {
      if (hasCowboyTag) {
        // When the user has the COWBOYS_2022 tag set from the backend we want to skip
        // the user straight to the dashboard and launch them into the Cowboys promo flyout
        nextProps.routerActions.push('/home')
        nextProps.saveGoal('cowboys2022', { firstLogin: true })
        nextProps.runGoals()
      } else if (
        createExchangeUserFlag &&
        signupRedirect !== SignupRedirectTypes.WALLET_HOME &&
        signupCountry !== 'RU'
      ) {
        nextProps.routerActions.push('/select-product')
      } else {
        nextProps.routerActions.push('/home')
        // for first time login users we need to run goal since this is a first page we show them
        // this is must have if feature flag is off
        nextProps.saveGoal('welcomeModal', { firstLogin: true })
        nextProps.runGoals()
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
    this.props.signupActions.setRegisterEmail(undefined)
    this.props.securityCenterActions.skipVerifyEmail(email)
    this.props.routerActions.push('/home')
    // for first time login users we need to run goal since this is a first page we show them
    this.props.saveGoal('welcomeModal', { firstLogin: true })
    this.props.runGoals()
  }

  render() {
    const isMetadataRecovery = Remote.Success.is(this.props.isMetadataRecoveryR)
    return (
      <VerifyEmail
        {...this.props}
        resendEmail={this.onResendEmail}
        skipVerification={this.skipVerification}
        isMetadataRecovery={isMetadataRecovery}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  appEnv: selectors.core.walletOptions.getAppEnv(state).getOrElse('prod'),
  createExchangeUserFlag: selectors.core.walletOptions
    .getCreateExchangeUserOnSignupOrLogin(state)
    .getOrElse(false),
  email: selectors.signup.getRegisterEmail(state) as string,
  hasCowboyTag: selectors.modules.profile.getCowboysTag(state).getOrElse(false),
  isEmailVerified: selectors.core.settings.getEmailVerified(state).getOrElse(false),
  isMetadataRecoveryR: selectors.signup.getMetadataRestore(state),
  signupCountry: selectors.signup.getSignupCountry(state),
  signupMetadata: selectors.signup.getProductSignupMetadata(state) as ProductSignupMetadata
})

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  miscActions: bindActionCreators(actions.core.data.misc, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch),
  runGoals: () => dispatch(actions.goals.runGoals()),
  saveGoal: (name, data) => dispatch(actions.goals.saveGoal({ data, name })),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch),
  signupActions: bindActionCreators(actions.signup, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(VerifyEmailContainer)
