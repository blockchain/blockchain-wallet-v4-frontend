import { actions, model, selectors } from 'data'
import { concat, prop } from 'ramda'
import { connect } from 'react-redux'
import React from 'react'

import LaunchExchange from './template'

const { EXCHANGE_EVENTS } = model.analytics

class LaunchExchangeCardContainer extends React.Component {
  handleSignup = () => {
    this.props.showModal()
    this.props.logEvent(EXCHANGE_EVENTS.BUY_SELL_CONNECT_WALLET_CLICKED)
  }
  handleLinkedWalletLinkout = () => {
    this.props.logEvent(EXCHANGE_EVENTS.BUY_SELL_LINKOUT_CLICKED)
  }

  render = () => {
    const { isExchangeAccountLinked, noMargin } = this.props

    return (
      <LaunchExchange
        handleSignup={this.handleSignup}
        handleLinkedWalletLinkout={this.handleLinkedWalletLinkout}
        isExchangeAccountLinked={isExchangeAccountLinked}
        noMargin={noMargin}
        exchangeUrl={concat(prop('exchange', this.props.domains), '/trade')}
      />
    )
  }
}

const mapStateToProps = state => ({
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({}),
  isExchangeAccountLinked: selectors.modules.profile
    .isExchangeAccountLinked(state)
    .getOrElse(false)
})

const mapDispatchToProps = dispatch => ({
  showModal: () =>
    dispatch(
      actions.modals.showModal('LinkToExchangeAccount', {
        utmCampaign: 'buy_sell_linked'
      })
    ),
  logEvent: event => dispatch(actions.analytics.logEvent(event))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LaunchExchangeCardContainer)
