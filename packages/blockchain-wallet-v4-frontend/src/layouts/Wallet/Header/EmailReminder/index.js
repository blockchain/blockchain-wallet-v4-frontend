import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
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
    const { data } = this.props
    const { reminded } = this.state

    return data.cata({
      Success: val => (
        <EmailReminder
          val={val}
          reminded={reminded}
          handleResendVerifyEmail={this.onResendVerifyEmail}
        />
      ),
      Failure: () => null,
      NotAsked: () => null,
      Loading: () => null
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.modules.securityCenter, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmailReminderContainer)
