import React from 'react'
import {connect} from 'react-redux'

import { convertToBitcoin, convertToCurrency } from 'services/ConversionService'
import { selectors } from 'data'

import Ticker from './template.js'

class TickerContainer extends React.Component {
  render () {
    let satoshiAmount = 100000000
    let conversionBitcoin = convertToBitcoin(satoshiAmount, this.props.unit).getOrElse('N/A')
    let conversionCurrency = convertToCurrency(satoshiAmount, this.props.currency, this.props.rates).getOrElse('N/A')

    return (
      <Ticker
        bitcoinValue={conversionBitcoin}
        currencyValue={conversionCurrency}
      />
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
