import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, model } from 'data'
import BtcLinkHandling from './template'

const { ENABLE_BTC_LINKS } = model.analytics.PREFERENCE_EVENTS.GENERAL
class BtcLinkHandlingContainer extends React.PureComponent {
  state = { warningDisplayed: false }

  handleClick = () => {
    this.setState({ warningDisplayed: !this.state.warningDisplayed })
    // Register bitcoin links
    this.props.preferencesActions.registerProtocolHandler(
      'bitcoin',
      '/#/open/%s',
      'Blockchain'
    )
    this.props.analyticsActions.logEvent(ENABLE_BTC_LINKS)
  }

  render () {
    return (
      <BtcLinkHandling
        warningDisplayed={this.state.warningDisplayed}
        handleClick={this.handleClick}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(BtcLinkHandlingContainer)
