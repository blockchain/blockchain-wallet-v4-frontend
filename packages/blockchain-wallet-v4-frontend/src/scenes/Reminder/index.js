import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions, selectors } from 'data'
import Reminder from './template.js'

class ReminderContainer extends React.Component {
  constructor () {
    super()
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()
    const { email, code, captcha, authActions } = this.props
    const { sessionToken } = captcha.getOrElse({})

    authActions.remindGuid(email, code, sessionToken)
  }

  render () {
    return <Reminder onSubmit={this.onSubmit} />
  }
}

const mapStateToProps = (state) => ({
  email: formValueSelector('reminder')(state, 'email'),
  code: formValueSelector('reminder')(state, 'code'),
  captcha: selectors.core.data.misc.getCaptcha(state)
})

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ReminderContainer)
