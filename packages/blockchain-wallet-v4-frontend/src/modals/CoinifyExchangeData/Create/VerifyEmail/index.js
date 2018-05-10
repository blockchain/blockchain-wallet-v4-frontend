import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import VerifyEmail from './template'

class VerifyEmailContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.onSubmit = this.onSubmit.bind(this)
    this.resendCode = this.resendCode.bind(this)
  }

  componentDidMount () {
    this.props.formActions.change('coinifyVerifyEmail', 'emailAddress', this.props.oldEmail)
  }

  resendCode () {
    this.props.updateUI({ codeSent: true })
    this.props.securityCenterActions.sendConfirmationCodeEmail(this.props.emailAddress)
  }

  onSubmit (e) {
    e.preventDefault()
    if (this.props.ui.create === 'enter_email_code') {
      this.props.coinifyActions.coinifyClearSignupError()
      this.props.securityCenterActions.verifyEmailCode(this.props.emailCode)
    } else {
      this.props.updateUI({ create: 'enter_email_code' })
      this.props.securityCenterActions.updateEmail(this.props.emailAddress)
      this.props.securityCenterActions.sendConfirmationCodeEmail(this.props.emailAddress)
    }
  }

  render () {
    const { emailVerifiedError, invalid, ui, updateUI } = this.props

    return <VerifyEmail
      emailVerifiedError={emailVerifiedError}
      invalid={invalid}
      onSubmit={this.onSubmit}
      resendCode={this.resendCode}
      ui={ui}
      updateUI={updateUI} />
  }
}

VerifyEmailContainer.propTypes = {
  ui: PropTypes.object,
  invalid: PropTypes.boolean,
  updateUI: PropTypes.function,
  emailAddress: PropTypes.string,
  formActions: PropTypes.object,
  emailCode: PropTypes.string,
  oldEmail: PropTypes.string
}

const mapStateToProps = (state) => getData(state)

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(VerifyEmailContainer)
