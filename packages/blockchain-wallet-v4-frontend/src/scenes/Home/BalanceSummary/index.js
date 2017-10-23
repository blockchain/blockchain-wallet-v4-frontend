import React from 'react'
import {connect} from 'react-redux'
import { prop, mapAccum, head } from 'ramda'

import { selectors } from 'data'
import BalanceSummary from './template.js'

class BalanceSummaryContainer extends React.Component {
  render () {
    const adder = (acc, value) => [acc + (prop('amount', value) || 0), (acc + prop('amount', value) || 0)]
    const total = head(mapAccum(adder, 0, this.props.balances))
    return (
      <BalanceSummary balances={this.props.balances} total={total} coinDisplayed={this.props.coinDisplayed} />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const accountsBalances = selectors.core.common.getAccountsBalances(state)
  const aggregatedLegacyAddressesBalances = selectors.core.common.getAggregatedAddressesBalances(state)
  return {
    balances: [...accountsBalances, aggregatedLegacyAddressesBalances],
    coinDisplayed: selectors.preferences.getCoinDisplayed(state)
  }
}

export default connect(mapStateToProps)(BalanceSummaryContainer)
