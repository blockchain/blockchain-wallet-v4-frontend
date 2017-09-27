import React from 'react'
import { connect } from 'react-redux'
import { selectors } from 'data'
import { equals, prop, path } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'

import ChartTicker from './template.js'

const { Currencies, Currency } = Exchange
const { BTC, ETH } = Currencies

class ChartTickerContainer extends React.Component {
  render () {
    const { coin, selectedCoin, currency, btcRates, ethRates } = this.props

    const CUR = prop(currency, Exchange.Currencies)
    const CURCode = prop('code', CUR)
    const CURunit = path(['units', CURCode], CUR)

    const oneBTC = Currency.fromUnit({value: '1', unit: BTC.units.BTC})
    const btcRate = oneBTC.chain(Currency.convert(btcRates, CUR))
                          .chain(Currency.toUnit(CURunit))
                          .map(Currency.unitToString)
                          .getOrElse('N/A')

    const oneETH = Currency.fromUnit({value: '1', unit: ETH.units.ETH})
    const ethRate = oneETH.chain(Currency.convert(ethRates, CUR))
                          .chain(Currency.toUnit(CURunit))
                          .map(Currency.unitToString)
                          .getOrElse('N/A')


    return (
      equals(coin, 'BTC') 
      ? <ChartTicker coin={coin} rate={btcRate} selectedCoin={selectedCoin} />
      : <ChartTicker coin={coin} rate={ethRate} selectedCoin={selectedCoin} />
    )
  }
}

const mapStateToProps = (state) => ({
  currency: selectors.core.settings.getCurrency(state),
  btcRates: selectors.core.btcRates.getBtcRates(state),
  ethRates: selectors.core.ethRates.getEthRates(state)
})

export default connect(mapStateToProps)(ChartTickerContainer)
