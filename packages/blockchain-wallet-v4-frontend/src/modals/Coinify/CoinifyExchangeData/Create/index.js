import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Create from './template'

class CreateContainer extends Component {
  state = { create: '', uniqueEmail: true, codeSent: false }

  /* eslint-disable react/no-did-mount-set-state, react/no-did-update-set-state */
  componentDidMount () {
    if (this.props.emailVerified) {
      this.setState({ create: 'create_account' })
    } else {
      this.setState({ create: 'enter_email_code' })
      this.props.securityCenterActions.sendConfirmationCodeEmail(
        this.props.oldEmail
      )
    }
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.emailVerified && this.props.emailVerified) {
      this.setState({ create: 'create_account' })
    }
  }
  /* eslint-enable react/no-did-mount-set-state, react/no-did-update-set-state */

  updateState = newState => {
    this.setState(newState)
  }

  render () {
    const { handleSignup, oldEmail, signupError } = this.props
    return (
      <Create
        handleSignup={handleSignup}
        oldEmail={oldEmail}
        signupError={signupError}
        updateState={this.updateState}
        country={this.props.country}
        create={this.state.create}
        codeSent={this.state.codeSent}
      />
    )
  }
}

CreateContainer.propTypes = {
  smsVerified: PropTypes.number.isRequired,
  emailVerified: PropTypes.number.isRequired,
  country: PropTypes.string.isRequired
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  securityCenterActions: bindActionCreators(
    actions.modules.securityCenter,
    dispatch
  )
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateContainer)
