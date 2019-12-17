import { actions, model, selectors } from 'data'
import { concat, prop } from 'ramda'
import { connect } from 'react-redux'
import React from 'react'

import LaunchPit from './template'

const { PIT_EVENTS } = model.analytics

class LaunchPitCardContainer extends React.Component {
  handleSignup = () => {
    this.props.showModal()
    this.props.logEvent(PIT_EVENTS.CONNECT_NOW)
  }

  handleLinkedWalletLinkout = () => {
    this.props.logEvent(PIT_EVENTS.LINKED_WALLET_LINKOUT_CLICKED)
  }

  render = () => {
    return (
      <LaunchPit
        handleSignup={this.handleSignup}
        handleLinkedWalletLinkout={this.handleLinkedWalletLinkout}
        isPitAccountLinked={this.props.isPitAccountLinked}
        noMargin={this.props.noMargin}
        pitUrl={concat(prop('thePit', this.props.domains), '/trade')}
      />
    )
  }
}

const mapStateToProps = state => ({
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({}),
  isPitAccountLinked: selectors.modules.profile
    .isPitAccountLinked(state)
    .getOrElse(false)
})

const mapDispatchToProps = dispatch => ({
  showModal: () =>
    dispatch(
      actions.modals.showModal('LinkToPitAccount', {
        utmCampaign: 'buy_sell_linked'
      })
    ),
  logEvent: event => dispatch(actions.analytics.logEvent(event))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LaunchPitCardContainer)
