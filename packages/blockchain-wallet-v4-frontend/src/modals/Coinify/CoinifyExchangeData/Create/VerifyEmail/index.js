import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import VerifyEmail from './template'

class VerifyEmailContainer extends Component {
  state = {}

  componentDidMount () {
    this.props.formActions.change(
      'coinifyVerifyEmail',
      'emailAddress',
      this.props.oldEmail
    )
  }

  resendCode = () => {
    this.props.updateState({ codeSent: true })
    this.props.securityCenterActions.sendConfirmationCodeEmail(
      this.props.emailAddress
    )
  }

  onSubmit = () => {
    if (this.props.create === 'enter_email_code') {
      this.props.coinifyActions.coinifyClearSignupError()
      this.props.securityCenterActions.verifyEmailCode(this.props.emailCode)
    } else {
      this.props.updateState({ create: 'enter_email_code' })
      this.props.securityCenterActions.updateEmail(this.props.emailAddress)
    }
  }

  render () {
    const {
      codeSent,
      create,
      emailAddress,
      emailVerifiedError,
      oldEmail,
      invalid,
      updateState
    } = this.props

    return (
      <VerifyEmail
        emailVerifiedError={emailVerifiedError}
        invalid={invalid}
        onSubmit={this.onSubmit}
        resendCode={this.resendCode}
        create={create}
        codeSent={codeSent}
        updateState={updateState}
        email={oldEmail}
        newEmail={emailAddress}
      />
    )
  }
}

VerifyEmailContainer.propTypes = {
  emailAddress: PropTypes.string,
  formActions: PropTypes.object,
  emailCode: PropTypes.string,
  oldEmail: PropTypes.string
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch),
  securityCenterActions: bindActionCreators(
    actions.modules.securityCenter,
    dispatch
  )
})

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(VerifyEmailContainer)
