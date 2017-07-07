import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import Reminder from './template.js'
import { actions } from 'data'

class ReminderContainer extends React.Component {
  constructor () {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (event) {
    event.preventDefault()
    // this.props.authActions.loginStart({ guid: this.props.guid, password: this.props.password })
  }

  render () {
    return (
      <Reminder handleClick={this.handleClick} />
    )
  }
}

function matchStateToProps (state) {
  const selector = formValueSelector('reminderForm')
  return {
    email: selector(state, 'email')
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
