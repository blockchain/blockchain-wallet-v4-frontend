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
    this.handleTrezor = this.handleTrezor.bind(this)
    this.openQRCodeCapture = this.openQRCodeCapture.bind(this)
  }

  handleSubmit (event) {
    event.preventDefault()
    this.props.authActions.loginStart({ guid: this.props.guid, password: this.props.password })
  }

  handleTrezor (event) {
    event.preventDefault()
    this.props.coreActions.createTrezorWallet(0)
  }

  openQRCodeCapture () {
    this.props.modalActions.showModal('QRCodeCapture')
  }

  render () {
    return (
      <Login
        handleSubmit={this.handleSubmit}
        handleTrezor={this.handleTrezor}
        openQRCodeCapture={this.openQRCodeCapture} />
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
    modalActions: bindActionCreators(actions.modals, dispatch),
    authActions: bindActionCreators(actions.auth, dispatch),
    alertActions: bindActionCreators(actions.alerts, dispatch),
    coreActions: bindActionCreators(actions.core.wallet, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer)
