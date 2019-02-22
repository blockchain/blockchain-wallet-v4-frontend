import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, model } from 'data'
import BitcoinLinkHandling from './template'

const { ENABLE_BTC_LINKS } = model.analytics.PREFERENCE_EVENTS.GENERAL
class BtcLinkHandlingContainer extends React.PureComponent {
  state = { warningDisplayed: false }

  handleClick = () => {
    this.setState({ warningDisplayed: !this.state.warningDisplayed })
    // Register bitcoin links
    window.navigator.registerProtocolHandler(
      'bitcoin',
      '/#/open/%s',
      'Blockchain'
    )
    this.props.analyticsActions.logEvent(ENABLE_BTC_LINKS)
  }

  render () {
    return (
      <BitcoinLinkHandling
        warningDisplayed={this.state.warningDisplayed}
        handleClick={this.handleClick}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(BtcLinkHandlingContainer)
