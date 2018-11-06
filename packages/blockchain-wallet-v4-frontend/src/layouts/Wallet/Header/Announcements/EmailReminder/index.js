import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import EmailReminder from './template'

class EmailReminderContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {}
  }

  onResendVerifyEmail = email => {
    if (this.state.reminded) return
    this.props.actions.resendVerifyEmail(email)
    this.setState({ reminded: true })
    setTimeout(() => {
      this.setState({ reminded: false })
    }, 3000)
  }

  render () {
    return (
      <EmailReminder
        email={this.props.email}
        reminded={this.state.reminded}
        handleResendVerifyEmail={this.onResendVerifyEmail}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.modules.securityCenter, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(EmailReminderContainer)
