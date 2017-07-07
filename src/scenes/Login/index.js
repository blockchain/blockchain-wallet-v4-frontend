import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import Login from './template.js'
import { actions } from 'data'

class LoginContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.handleClick = this.handleClick.bind(this)
    this.handleTrezor = this.handleTrezor.bind(this)
  }

  handleClick (event) {
    event.preventDefault()
    this.props.authActions.loginStart({ guid: this.props.guid, password: this.props.password })
  }

  handleTrezor (event) {
    event.preventDefault()
    this.props.coreActions.createTrezorWallet(0)
  }

  render () {
    return (
      <Login handleClick={this.handleClick} handleTrezor={this.handleTrezor} />
    )
  }
}

function matchStateToProps (state) {
  const selector = formValueSelector('loginForm')
  return {
    guid: selector(state, 'guid'),
    password: selector(state, 'password')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    authActions: bindActionCreators(actions.auth, dispatch),
    alertActions: bindActionCreators(actions.alerts, dispatch),
    coreActions: bindActionCreators(actions.core.wallet, dispatch)
  }
}

export default connect(matchStateToProps, mapDispatchToProps)(LoginContainer)
