import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { api } from 'services/ApiService'

import Reminder from './template.js'
import { actions } from 'data'

class ReminderContainer extends React.Component {
  constructor () {
    super()
    this.state = { timestamp: new Date().getTime() }
    this.handleClick = this.handleClick.bind(this)
  }

  success (data) {
    const { message } = data
    console.log(message)
    // TODO: Handle multilanguages
    switch (message) {
      case 'Confirmation Email Sent':
        this.props.alertActions.displaySuccess(message)
        break
      case 'Captcha Code Incorrect':
        this.props.alertActions.displayError(message)
        this.setState({ timestamp: new Date().getTime() })
        break
      case 'Quota Exceeded':
        this.props.alertActions.displayError(message)
        this.setState({ timestamp: new Date().getTime() })
        break
      default:
        this.props.alertActions.displayError('Unknown error')
        this.setState({ timestamp: new Date().getTime() })
    }
  }

  handleClick (event) {
    event.preventDefault()
    api.recoverWallet(this.props.email, this.props.captcha).then(
      data => this.success(data),
      message => this.props.alertActions.displayError(message)
    )
    // this.props.authActions.loginStart({ guid: this.props.guid, password: this.props.password })
  }

  render () {
    return (
      <Reminder handleClick={this.handleClick} timestamp={this.state.timestamp} />
    )
  }
}

function matchStateToProps (state) {
  const selector = formValueSelector('reminderForm')
  return {
    email: selector(state, 'email'),
    captcha: selector(state, 'captcha')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    authActions: bindActionCreators(actions.auth, dispatch),
    alertActions: bindActionCreators(actions.alerts, dispatch),
    coreActions: bindActionCreators(actions.core.wallet, dispatch)
  }
}

export default connect(matchStateToProps, mapDispatchToProps)(ReminderContainer)
