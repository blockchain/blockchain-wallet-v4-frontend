import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import VerifyEmail from './template'

class VerifyEmailContainer extends PureComponent {
  componentDidMount () {
    this.props.formActions.change(
      'coinifyVerifyEmail',
      'emailAddress',
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

  render () {
    const { emailVerifiedError, invalid } = this.props

    return (
      <VerifyEmail
        emailVerifiedError={emailVerifiedError}
        invalid={invalid}
        onSubmit={this.onSubmit}
        resend={this.resend}
        email={this.props.oldEmail}
        newEmail={this.props.emailAddress}
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
