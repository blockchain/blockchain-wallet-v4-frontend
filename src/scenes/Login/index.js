import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Login from './template.js'
import { actions } from 'data'

class LoginContainer extends React.Component {
  constructor () {
    super()
    this.state = {
      values: { guid: '', password: '' },
      validation: { guid: null, password: null }
    }

    this.onChange = this.onChange.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  onChange (event) {
    const values = this.state.values
    const validation = this.state.validation
    const name = event.target.name
    const value = event.target.value

    switch (name) {
      case 'guid':
        values.guid = value
        validation.guid = value !== '' ? 'success' : 'error'
        break
      case 'password':
        values.password = value
        validation.password = value !== '' ? 'success' : 'error'
        break
    }

    this.setState({ values: values, validation: validation })
  }

  validate () {
    const validation = this.state.validation

    if (this.state.values.guid === '') { validation.guid = 'error' }
    if (this.state.values.password === '') { validation.password = 'error' }

    this.setState({ validation: validation })

    return validation.guid !== 'error' && validation.password !== 'error'
  }

  onClick (event) {
    if (!this.validate()) {
      this.props.alertActions.displayError('Login failed.')
      return
    }
    this.props.authActions.loginStart(this.state.values)
  }

  render () {
    return (
      <Login
        values={this.state.values}
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
