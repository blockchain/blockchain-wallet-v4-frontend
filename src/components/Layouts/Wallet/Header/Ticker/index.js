import React from 'react'
import {connect} from 'react-redux'

import { convertFromUnit, displayCoin, displayFiat } from 'services/ConversionService'
import { selectors } from 'data'

import Ticker from './template.js'

class TickerContainer extends React.Component {
  render () {
    const { network, unit, currency, rates } = this.props
    const baseCoin = convertFromUnit(network, 1, unit).getOrElse('N/A')
    const amount = baseCoin.amount
    const coin = displayCoin(network, amount, unit).getOrElse({ amount: 'N/A', symbol: '' })
    const fiat = displayFiat(network, amount, currency, rates).getOrElse({ amount: 'N/A', symbol: '' })

    return (
      <Ticker coin={coin} fiat={fiat} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    network: 'bitcoin',
    unit: selectors.core.settings.getBtcCurrency(state),
    currency: selectors.core.settings.getCurrency(state),
    rates: selectors.core.rates.getRates(state)
  }
}

export default connect(mapStateToProps)(TickerContainer)
