import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Register from './template.js'
import { actions } from 'data'

class RegisterContainer extends React.Component {
  constructor () {
    super()
    this.submit = this.submit.bind(this)
    this.submitFailed = this.submitFailed.bind(this)
  }

  submit () {
    this.props.alertActions.displaySuccess('Registration completed!')
  }

  submitFailed () {
    this.props.alertActions.displayError('Registration failed!')
  }

  render () {
    return (
      <Register submit={this.submit} submitFailed={this.submitFailed} />
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    authActions: bindActionCreators(actions.auth, dispatch),
    alertActions: bindActionCreators(actions.alerts, dispatch)
  }
}

export default connect(undefined, mapDispatchToProps)(RegisterContainer)
