import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { isValidEmail, passwordStrongness } from 'services/ValidationHelper'
import Register from './template.js'
import { actions } from 'data'

class RegisterContainer extends React.Component {
  constructor () {
    super()
    this.state = {
      values: { email: '', password: '', confirmationPassword: '', terms: false },
      validation: { email: null, password: null, confirmationPassword: null, terms: null },
      errors: {
        email: { empty: null, invalid: null },
        password: { empty: null, invalid: null },
        confirmationPassword: { empty: null, invalid: null },
        terms: { invalid: true }
      }
    }

    this.onChange = this.onChange.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  onChange (event) {
    const values = this.state.values
    const value = event.target.value
    const checked = event.target.checked
    console.log(checked)

    switch (event.target.name) {
      case 'email':
        values.email = value
        this.validateEmail(value)
        break
      case 'password':
        values.password = value
        this.validatePassword(value)
        break
      case 'confirmationPassword':
        values.confirmationPassword = value
        this.validateConfirmationPassword(values.password, value)
        break
      case 'terms':
        values.terms = checked
        this.validateTerms(checked)
        break
    }

    this.setState({ values: values })
  }

  validateEmail (email) {
    const validation = this.state.validation
    const errors = this.state.errors

    errors.email.empty = email === ''
    errors.email.invalid = !isValidEmail(email)
    validation.email = errors.email.empty || errors.email.invalid ? 'error' : 'success'

    this.setState({ validation, errors })
  }

  validatePassword (password) {
    const validation = this.state.validation
    const errors = this.state.errors

    errors.password.empty = password === ''
    errors.password.invalid = passwordStrongness(password) < 5
    validation.password = errors.password.empty || errors.password.invalid ? 'error' : 'success'

    this.setState({ validation, errors })
  }

  validateConfirmationPassword (password, confirmationPassword) {
    const validation = this.state.validation
    const errors = this.state.errors

    errors.confirmationPassword.empty = confirmationPassword === ''
    errors.confirmationPassword.invalid = confirmationPassword !== password
    validation.confirmationPassword = errors.confirmationPassword.empty || errors.confirmationPassword.invalid ? 'error' : 'success'

    this.setState({ validation, errors })
  }

  validateTerms () {
    const values = this.state.values
    const validation = this.state.validation
    const errors = this.state.errors

    errors.terms.invalid = !values.terms
    validation.terms = errors.terms.invalid ? 'error' : 'success'

    this.setState({ validation, errors })
  }

  validateForm () {
    const errors = this.state.errors
    return !errors.email.empty &&
           !errors.email.invalid &&
           !errors.password.empty &&
           !errors.password.invalid &&
           !errors.confirmationPassword.empty &&
           !errors.confirmationPassword.invalid &&
           !errors.terms.invalid
  }

  onClick (event) {
    console.log(this.state.errors)
    if (!this.validateForm()) {
      this.props.alertActions.displayError('Registration failed.')
    } else {
      this.props.alertActions.displaySuccess('Registration completed!')
    }
  }

  render () {
    return (
      <Register
        values={this.state.values}
        validation={this.state.validation}
        errors={this.state.errors}
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

export default connect(undefined, mapDispatchToProps)(RegisterContainer)
