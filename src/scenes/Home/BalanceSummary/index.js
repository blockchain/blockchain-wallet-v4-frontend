import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import BalanceSummary from './template.js'

class BalanceSummaryContainer extends React.Component {
  render () {
    let balances = [{
      title: 'My Bitcoin Wallet',
      amount: 0.00199132
    }, {
      title: 'beer budget',
      amount: 0
    }, {
      title: 'my single legacy address',
      amount: 0
    }]
    let total = 0.00199132

    return (
      <BalanceSummary balances={balances} total={total} />
    )
  }
}

function mapStateToProps (state, ownProps) {
  return {
    balances: null
  }
}

export default connect(mapStateToProps)(BalanceSummaryContainer)
