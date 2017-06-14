import React from 'react'
import {connect} from 'react-redux'
import { path } from 'ramda'

import { convertToBitcoin, convertToCurrency } from 'services/conversionService'
import { selectors } from 'data'

import Ticker from './template.js'

class TickerContainer extends React.Component {
  render () {
    let satoshiAmount = 100000000
    let conversionBitcoin = convertToBitcoin(satoshiAmount, this.props.unit)
    let conversionCurrency = convertToCurrency(satoshiAmount, this.props.currency, this.props.rates)

    return (
      <Ticker
        bitcoinValue={conversionBitcoin.success ? conversionBitcoin.value : 'N/A'}
        currencyValue={conversionCurrency.success ? conversionCurrency.value : 'N/A'}
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
