import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import EthereumTicker from './template.js'

class EthereumTickerContainer extends React.Component {
  render () {
    const { coin, rate } = this.props.tickerEthereum

    return <EthereumTicker selected={coin === 'ETH'} {...this.props}>{rate}</EthereumTicker>
  }
}

const mapStateToProps = (state) => ({
  tickerEthereum: selectors.modules.tickerEther.getTickerEther(state)
})

export default connect(mapStateToProps)(EthereumTickerContainer)
