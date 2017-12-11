import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import BitcoinTicker from './template.js'

class BitcoinTickerContainer extends React.Component {
  render () {
    const { coin, rate } = this.props.tickerBitcoin

    return <BitcoinTicker selected={coin === 'BTC'} {...this.props}>{rate}</BitcoinTicker>
  }
}

const mapStateToProps = (state) => ({
  tickerBitcoin: selectors.modules.tickerBitcoin.getTickerBitcoin(state)
})

export default connect(mapStateToProps)(BitcoinTickerContainer)
