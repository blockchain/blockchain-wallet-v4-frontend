import { actions, model } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Exchange from './template'
import React from 'react'

const { PIT_EVENTS } = model.analytics

class ExchangeContainer extends React.PureComponent {
  onSignup = () => {
    this.props.modalActions.showModal('LinkToExchangeAccount')
    this.props.analyticsActions.logEvent(PIT_EVENTS.CONNECT_NOW)
  }

  onLearnMore = () => {
    this.props.analyticsActions.logEvent(PIT_EVENTS.LEARN_MORE)
  }

  render () {
    return (
      <Exchange
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
)(ExchangeContainer)
