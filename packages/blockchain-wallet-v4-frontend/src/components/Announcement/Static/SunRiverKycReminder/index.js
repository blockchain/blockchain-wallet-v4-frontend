import React from 'react'
import { connect } from 'react-redux'

import { actions } from 'data'
import KycReminderReminder from './template'

class SunRiverKycReminderContainer extends React.PureComponent {
  render () {
    return <KycReminderReminder goToKyc={this.props.verifyIdentity} />
  }
}

const mapDispatchToProps = dispatch => ({
  verifyIdentity: () =>
    dispatch(actions.components.identityVerification.verifyIdentity())
})

export default connect(
  null,
  mapDispatchToProps
)(SunRiverKycReminderContainer)
