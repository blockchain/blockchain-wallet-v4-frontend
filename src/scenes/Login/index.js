import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Login from './template.js'
import { actions } from 'data'

class LoginContainer extends React.Component {
  constructor () {
    super()
    this.onSubmit = this.onSubmit.bind(this)
    this.onTrezor = this.onTrezor.bind(this)
  }

  onSubmit (event) {
    // this.props.alertActions.displayError('Login failed.')
    this.props.authActions.loginStart(this.state.values)
  }

  onTrezor () {
    this.props.coreActions.createTrezorWallet(0)
  }

  render () {
    return (
      <Login onSubmit={this.onSubmit} onTrezor={this.onTrezor} />
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    authActions: bindActionCreators(actions.auth, dispatch),
    alertActions: bindActionCreators(actions.alerts, dispatch),
    coreActions: bindActionCreators(actions.core.wallet, dispatch)
  }
}

export default connect(undefined, mapDispatchToProps)(LoginContainer)
