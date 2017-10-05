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
    const { email, code, captcha, walletActions } = this.props
    const { sessionToken } = captcha
    walletActions.remindWalletGuid(email, code, sessionToken)
    // api.recoverWallet(this.props.email, this.props.captcha).then(
    //   data => this.success(data),
    //   message => this.props.alertActions.displayError(message)
    // )
    // this.props.authActions.login({ guid: this.props.guid, password: this.props.password })
  }

  render () {
    return (
      <Reminder onSubmit={this.onSubmit} />
    )
  }
}

const mapStateToProps = (state) => ({
  email: formValueSelector('reminder')(state, 'email'),
  code: formValueSelector('reminder')(state, 'code'),
  captcha: selectors.core.captcha.getCaptcha(state)
})

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  alertActions: bindActionCreators(actions.alerts, dispatch),
  walletActions: bindActionCreators(actions.core.wallet, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ReminderContainer)
