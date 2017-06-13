import React from 'react'
import {connect} from 'react-redux'
import { prop, mapAccum, head } from 'ramda'

import { selectors } from 'data'
import BalanceSummary from './template.js'

class BalanceSummaryContainer extends React.Component {
  render () {
    const adder = (acc, value) => [acc + prop('amount', value), acc + prop('amount', value)]
    const total = head(mapAccum(adder, 0, this.props.balances))
    return (
      <BalanceSummary balances={this.props.balances} total={total} bitcoinDisplayed={this.props.bitcoinDisplayed} />
    )
  }
}

function mapStateToProps (state, ownProps) {
  return {
    balances: selectors.core.common.getLabelBalances(state),
    bitcoinDisplayed: selectors.ui.getBitcoinDisplayed(state)
  }
}

export default connect(mapStateToProps)(BalanceSummaryContainer)
