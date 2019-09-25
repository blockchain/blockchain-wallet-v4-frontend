import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, model } from 'data'
import ThePit from './template'

const { PIT_EVENTS } = model.analytics

class ThePitContainer extends React.PureComponent {
  onSignup = () => {
    this.props.modalActions.showModal('LinkToPitAccount')
    this.props.analyticsActions.logEvent(PIT_EVENTS.CONNECT_NOW)
  }

  onLearnMore = () => {
    this.props.analyticsActions.logEvent(PIT_EVENTS.LEARN_MORE)
  }

  render () {
    return <ThePit onSignup={this.onSignup} onLearnMore={this.onLearnMore} />
  }
}

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(ThePitContainer)
