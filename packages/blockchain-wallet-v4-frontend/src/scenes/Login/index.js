import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import Login from './template.js'
import { actions, selectors } from 'data'

class LoginContainer extends React.Component {
  constructor () {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleMobile = this.handleMobile.bind(this)
  }

  handleSubmit (event) {
    event.preventDefault()
    const { guid, password, code } = this.props
    this.props.authActions.loginStart({ guid, password, code })
  }

  handleMobile () {
    this.props.modalActions.showModal('MobileLogin')
  }

  render () {
    const { authType } = this.props

    return (
      <Login
        authType={authType}
        handleSubmit={this.handleSubmit}
        handleMobile={this.handleMobile} />
    )
  }
}

const mapStateToProps = (state) => ({
  guid: formValueSelector('loginForm')(state, 'guid'),
  password: formValueSelector('loginForm')(state, 'password'),
  code: formValueSelector('loginForm')(state, 'code'),
  authType: selectors.auth.getAuthType(state)
})

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  alertActions: bindActionCreators(actions.alerts, dispatch),
  coreActions: bindActionCreators(actions.core.wallet, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer)
