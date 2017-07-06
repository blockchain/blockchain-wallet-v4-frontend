import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Login from './template.js'
import { actions } from 'data'

class LoginContainer extends React.Component {
  constructor () {
    super()
    this.state = {
      credentials: { guid: '', password: '' },
      validation: { guid: null, password: null }
    }

    this.onChange = this.onChange.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  onChange (event) {
    const credentials = this.state.credentials
    const validation = this.state.validation
    const name = event.target.name
    const value = event.target.value

    switch (name) {
      case 'guid':
        credentials.guid = value
        validation.guid = value !== '' ? 'success' : 'error'
        break
      case 'password':
        credentials.password = value
        validation.password = value !== '' ? 'success' : 'error'
        break
    }

    this.setState({ credentials: credentials, validation: validation })
  }

  validate () {
    const validation = this.state.validation

    if (this.state.credentials.guid === '') { validation.guid = 'error' }
    if (this.state.credentials.password === '') { validation.password = 'error' }

    this.setState({ validation: validation })

    return validation.guid !== 'error' && validation.password !== 'error'
  }

  onClick (event) {
    if (!this.validate()) {
      this.props.alertActions.displayError('Login failed.')
      return
    }
    this.props.authActions.loginStart(this.state.credentials)
  }

  render () {
    return (
      <Login
        credentials={this.state.credentials}
        validation={this.state.validation}
        disabled={this.state.disabled}
        onChange={this.onChange}
        onClick={this.onClick}
      />
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    authActions: bindActionCreators(actions.auth, dispatch),
    alertActions: bindActionCreators(actions.alerts, dispatch)
  }
}

export default connect(undefined, mapDispatchToProps)(LoginContainer)
