import React from 'react'
import {connect} from 'react-redux'

import { convertFromUnit, displayCoin, displayFiat, coinScale } from 'services/ConversionService'
import { selectors } from 'data'

import Ticker from './template.js'

import styled from 'styled-components'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: white;
`

class TickerContainer extends React.Component {
  render () {
    const { network, unit, currency, btcRates, ethRates } = this.props
    const btcAmount = coinScale('bitcoin')
    const baseCoin = convertFromUnit(network, 1, unit).getOrElse('N/A')
    const amount = baseCoin.amount
    const btcCoin = `1 BTC`
    const ethCoin = `1 ETH`
    const btcRate = displayFiat(network, btcAmount, currency, btcRates).getOrElse('N/A')
    const ethRate = displayFiat(network, btcAmount, currency, ethRates).getOrElse('N/A')

    return (
      <Row>
        <Ticker coin={btcCoin} fiat={btcRate} />
        <Ticker coin={ethCoin} fiat={ethRate} />
      </Row>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    network: 'bitcoin',
    unit: selectors.core.settings.getBtcCurrency(state),
    currency: selectors.core.settings.getCurrency(state),
    btcRates: selectors.core.btcRates.getBtcRates(state),
    ethRates: selectors.core.ethRates.getEthRates(state)
  }
}

export default connect(mapStateToProps)(TickerContainer)
