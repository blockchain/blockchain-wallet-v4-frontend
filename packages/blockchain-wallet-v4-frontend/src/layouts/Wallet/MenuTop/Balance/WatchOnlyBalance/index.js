import React from 'react'
import { gt } from 'ramda'
import Template from './template'
import { connect } from 'react-redux'
import { getBtcWatchOnlyBalance, getBchWatchOnlyBalance } from './selectors'

class Balance extends React.PureComponent {
  render () {
    const { btcWatchOnlyBalance, bchWatchOnlyBalance } = this.props
    const totalWatchOnlyBalance =
      btcWatchOnlyBalance.getOrElse(0) + bchWatchOnlyBalance.getOrElse(0)
    return gt(totalWatchOnlyBalance, 0) && <Template />
  }
}

const mapStateToProps = state => ({
  btcWatchOnlyBalance: getBtcWatchOnlyBalance(state),
  bchWatchOnlyBalance: getBchWatchOnlyBalance(state)
})

export default connect(mapStateToProps)(Balance)
