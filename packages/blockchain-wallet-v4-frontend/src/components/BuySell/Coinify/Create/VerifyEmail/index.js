import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'

import { model, actions } from 'data'

import { getData } from './selectors'
import VerifyEmail from './template'

const { EMAIL_STEPS } = model.components.identityVerification

class VerifyEmailContainer extends PureComponent {
  componentDidMount () {
    this.props.formActions.change(
      'coinifyVerifyEmail',
      'email',
      this.props.email
    )
  }

  resend = () => {
    this.props.securityCenterActions.updateEmail(this.props.emailAddress)
  }

  onSubmit = () => {
    this.resend()
    this.props.updateCodeSent(true)
  }

  editEmail = () => {
    this.props.actions.setEmailStep(EMAIL_STEPS.edit)
  }

  render () {
    const {
      actions,
      emailStep,
      emailVerified,
      emailVerifiedError,
      invalid
    } = this.props

    return (
      <VerifyEmail
        editEmail={this.editEmail}
        email={this.props.oldEmail}
        emailStep={emailStep}
        emailVerified={emailVerified}
        emailVerifiedError={emailVerifiedError}
        invalid={invalid}
        newEmail={this.props.emailAddress}
        onSubmit={this.onSubmit}
        resend={this.resend}
        sendEmailVerification={actions.sendEmailVerification}
        updateEmail={actions.updateEmail}
        {...this.props}
      />
    )
  }
}

VerifyEmailContainer.propTypes = {
  invalid: PropTypes.boolean,
  emailAddress: PropTypes.string,
  formActions: PropTypes.object,
  emailCode: PropTypes.string,
  oldEmail: PropTypes.string
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  formActions: bindActionCreators(actions.form, dispatch),
  coinifyActions: bindActionCreators(actions.components.coinify, dispatch),
  securityCenterActions: bindActionCreators(
    actions.modules.securityCenter,
    dispatch
  )
})

export default connect(
  getData,
  mapDispatchToProps
)(VerifyEmailContainer)
