import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ui from 'redux-ui'
import { bindActionCreators, compose } from 'redux'

import { actions, model } from 'data'
import { getData } from './selectors'
import Create from './template'

const { COINIFY_SIGNUP_STATES } = model.coinify

class CreateContainer extends Component {
  componentDidMount () {
    if (this.props.emailVerified) {
      this.props.updateUI({ create: 'create_account' })
    } else {
      this.props.updateUI({ create: 'enter_email_code' })
      this.props.securityCenterActions.sendConfirmationCodeEmail(
        this.props.oldEmail
      )
    }
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.emailVerified && this.props.emailVerified) {
      this.props.updateUI({ create: 'create_account' })
    }
    if (prevProps.signupError && !prevProps.emailVerified && this.props.emailVerified) {
      this.props.coinifyFrontendActions.coinifyClearSignupError()
    }
  }

  render () {
    const { handleSignup, oldEmail, signupError, ui, updateUI, coinifyFrontendActions } = this.props
    return (
      <Create
        handleSignup={handleSignup}
        oldEmail={oldEmail}
        signupError={signupError}
        ui={ui}
        updateUI={updateUI}
        country={this.props.country}
        onGoBack={() => coinifyFrontendActions.coinifyNextStep(COINIFY_SIGNUP_STATES.NONE)}
      />
    )
  }
}

CreateContainer.propTypes = {
  ui: PropTypes.object,
  updateUI: PropTypes.function,
  smsVerified: PropTypes.number.isRequired,
  emailVerified: PropTypes.number.isRequired,
  country: PropTypes.string.isRequired
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  coinifyFrontendActions: bindActionCreators(actions.modules.coinify, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  securityCenterActions: bindActionCreators(
    actions.modules.securityCenter,
    dispatch
  )
})

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  ui({ state: { create: '', uniqueEmail: true, codeSent: false } })
)

export default enhance(CreateContainer)
