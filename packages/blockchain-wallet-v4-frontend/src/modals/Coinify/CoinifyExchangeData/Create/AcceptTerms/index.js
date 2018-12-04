import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'

import AcceptTerms from './template'

class AcceptTermsContainer extends PureComponent {
  state = {
    busy: false
  }

  componentDidUpdate (prevProps) {
    if (this.props.signupError && !prevProps.signupError) {
      // eslint-disable-next-line
      this.setState({ busy: false })
      this.props.updateUniqueEmail(false)
    }
  }

  handleResend = () => {
    this.props.securityCenterActions.updateEmail(this.props.email)
  }

  onSubmit = () => {
    this.setState({ busy: true })
    this.props.coinifyFrontendActions.coinifySignup(this.props.country)
  }

  render () {
    const {
      invalid,
      email,
      emailVerified,
      signupError,
      coinifyFrontendActions,
      create
    } = this.props
    const { coinifyClearSignupError } = coinifyFrontendActions

    return (
      <AcceptTerms
        busy={this.state.busy}
        email={email}
        emailVerified={emailVerified}
        invalid={invalid}
        onSubmit={this.onSubmit}
        signupError={signupError}
        editEmail={() => {
          this.props.updateCreate('change_email')
        }}
        clearError={() => coinifyClearSignupError()}
        create={create}
        handleResend={this.handleResend}
      />
    )
  }
}

AcceptTermsContainer.propTypes = {
  invalid: PropTypes.bool,
  email: PropTypes.string.isRequired,
  country: PropTypes.string
}

const mapDispatchToProps = dispatch => ({
  coinifyFrontendActions: bindActionCreators(actions.modules.coinify, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(AcceptTermsContainer)
