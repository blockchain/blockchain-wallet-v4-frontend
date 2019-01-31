import React from 'react'
import { actions, model } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import ShowXpubs from './template'

const { SHOW_XPUBS } = model.analytics.LOCKBOX_EVENTS.SETTINGS
class ShowXPubsContainer extends React.PureComponent {
  onShowXPubs = () => {
    this.props.modalActions.showModal('LockboxShowXPubs', {
      deviceIndex: this.props.deviceIndex
    })
    this.props.analyticsActions.logEvent(SHOW_XPUBS)
  }

  render () {
    return <ShowXpubs onShowXPubs={this.onShowXPubs} />
  }
}

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(ShowXPubsContainer)
