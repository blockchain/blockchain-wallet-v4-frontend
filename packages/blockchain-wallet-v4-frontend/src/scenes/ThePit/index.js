import { actions, model } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'
import ThePit from './template'

const { PIT_EVENTS } = model.analytics

class ThePitContainer extends React.PureComponent {
  componentDidMount () {
    this.props.preferencesActions.hideThePitPulse()
  }

  onSignup = () => {
    this.props.modalActions.showModal('LinkToPitAccount')
    this.props.analyticsActions.logEvent(PIT_EVENTS.CONNECT_NOW)
  }

  onLearnMore = () => {
    this.props.analyticsActions.logEvent(PIT_EVENTS.LEARN_MORE)
  }

  render () {
    return (
      <ThePit
        onSignup={this.onSignup}
        onLearnMore={this.onLearnMore}
        {...this.props}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(ThePitContainer)
