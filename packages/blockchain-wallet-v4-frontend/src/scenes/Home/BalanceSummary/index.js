import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { compose, map, reduce, add } from 'ramda'

import { actions, selectors } from 'data'
import BalanceSummary from './template.js'

const getTotalBalance = compose(reduce(add, 0), map(value => value.amount))

class BalanceSummaryContainer extends React.Component {
  componentWillMount () {
    this.props.initBalanceSummary()
  }

  render () {
    let { bitcoinBalances } = this.props
    return <BalanceSummary bitcoinBalances={bitcoinBalances} total={getTotalBalance(bitcoinBalances)} />
  }
}

const mapStateToProps = selectors.modules.balanceSummary.getBalanceSummaryData
const mapDispatchToProps = (dispatch) => bindActionCreators(actions.modules.balanceSummary, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(BalanceSummaryContainer)
