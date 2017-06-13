import React from 'react'
import {connect} from 'react-redux'
import { path } from 'ramda'

import { selectors } from 'data'

import Ticker from './template.js'

class TickerContainer extends React.Component {
  render () {
    let bitcoin = 100000000
    let bitcoinAmount = 0
    let currencyAmount = 0
    let bitcoinUnit = this.props.unit
    let currencyUnit = this.props.currency
    let rates = this.props.rates

    switch (bitcoinUnit) {
      case 'UBC':
        bitcoinAmount = parseFloat((bitcoin / 100).toFixed(2))
        bitcoinUnit = 'bits'
        break
      case 'MBC':
        bitcoinAmount = parseFloat((bitcoin / 100000).toFixed(5))
        bitcoinUnit = 'mBTC'
        break
      case 'BTC':
        bitcoinAmount = parseFloat((bitcoin / 100000000).toFixed(8))
        bitcoinUnit = 'BTC'
        break
    }

    let ratio = path([currencyUnit, 'last'], rates)
    currencyAmount = parseFloat((bitcoin * ratio / 100000000).toFixed(2))

    return (
      <Ticker
        bitcoinAmount={bitcoinAmount}
        bitcoinUnit={bitcoinUnit}
        currencyAmount={currencyAmount}
        currencyUnit={currencyUnit} />
    )
  }
}

function mapStateToProps (state) {
  return {
    unit: selectors.core.settings.getBtcCurrency(state),
    currency: selectors.core.settings.getCurrency(state),
    rates: selectors.core.rates.getRates(state)
  }
}

export default connect(mapStateToProps)(TickerContainer)
