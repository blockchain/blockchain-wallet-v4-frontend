import React from 'react'
import {connect} from 'react-redux'
import { equals, prop, path } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'
import { convertFromUnit, displayCoin, displayFiat, coinScale } from 'services/ConversionService'
import { selectors } from 'data'

import Ticker from './template.js'

import styled from 'styled-components'

const BTC = Exchange.Currencies.BTC
const ETH = Exchange.Currencies.ETH
const Currency = Exchange.Currency
const Pairs = Exchange.Pairs

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: white;
`

class TickerContainer extends React.Component {

  shouldComponentUpdate (nextProps) {
    if (!equals(this.props.btcraw, nextProps.btcraw)
      || !equals(this.props.ethraw, nextProps.ethraw)
      || !equals(this.props.currency, nextProps.currency)) {
      return true
    }
    return false
  }

  render () {
    const { currency, btcRates, ethRates } = this.props
    
    const CUR = prop(currency, Exchange.Currencies)
    const CURCode = prop('code', CUR)
    const CURunit = path(['units', CURCode], CUR)

    const oneBTC = Currency.fromUnit({value: '1', unit: BTC.units.BTC})
    const btcCoin = oneBTC.chain(Currency.toUnit(BTC.units.BTC))
                          .map(Currency.unitToString)
                          .getOrElse('N/A')
    const btcRate = oneBTC.chain(Currency.convert(btcRates, CUR))
                          .chain(Currency.toUnit(CURunit))
                          .map(Currency.unitToString)
                          .getOrElse('N/A')

    const oneETH = Currency.fromUnit({value: '1', unit: ETH.units.ETH})
    const ethCoin = oneETH.chain(Currency.toUnit(ETH.units.ETH))
                          .map(Currency.unitToString)
                          .getOrElse('N/A')
    const ethRate = oneETH.chain(Currency.convert(ethRates, CUR))
                          .chain(Currency.toUnit(CURunit))
                          .map(Currency.unitToString)
                          .getOrElse('N/A')

    return (
      <Row>
        <Ticker coin={btcCoin} fiat={btcRate} />
        <span>&nbsp;</span>
        <Ticker coin={ethCoin} fiat={ethRate} />
      </Row>
    )
  }
}

const mapStateToProps = (state) => {
  const btcraw = selectors.core.btcRates.getBtcRates(state)
  const ethraw = selectors.core.ethRates.getEthRates(state)
  return {
    currency: selectors.core.settings.getCurrency(state),
    btcRates: Pairs.create(BTC.code, btcraw),
    ethRates: Pairs.create(ETH.code, ethraw),
    btcraw,
    ethraw
  }
}

export default connect(mapStateToProps)(TickerContainer)
