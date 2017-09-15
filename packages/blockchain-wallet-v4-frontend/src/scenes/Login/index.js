import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import Login from './template.js'
import { actions } from 'data'

class LoginContainer extends React.Component {
  constructor () {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (event) {
    event.preventDefault()
    this.props.authActions.loginStart({ guid: this.props.guid, password: this.props.password })
  }

  render () {
    return (
      <Login handleSubmit={this.handleSubmit} />
    )
  }
}

const mapStateToProps = (state) => {
  const selector = formValueSelector('loginForm')
  return {
    guid: selector(state, 'guid'),
    password: selector(state, 'password')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    authActions: bindActionCreators(actions.auth, dispatch),
    alertActions: bindActionCreators(actions.alerts, dispatch),
    coreActions: bindActionCreators(actions.core.wallet, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer)
