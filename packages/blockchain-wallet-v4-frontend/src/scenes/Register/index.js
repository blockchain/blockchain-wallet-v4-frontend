import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import Register from './template.js'
import { actions } from 'data'

class RegisterContainer extends React.Component {
  constructor () {
    super()
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()
    const { email, password } = this.props
    this.props.alertActions.displayInfo('Creating wallet...')
    this.props.authActions.register(email, password)
  }

  render () {
    return (
      <Register onSubmit={this.onSubmit} />
    )
  }
}

const mapStateToProps = (state) => ({
  email: formValueSelector('register')(state, 'email'),
  password: formValueSelector('register')(state, 'password')
})

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch),
  walletActions: bindActionCreators(actions.core.wallet, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(RegisterContainer)
