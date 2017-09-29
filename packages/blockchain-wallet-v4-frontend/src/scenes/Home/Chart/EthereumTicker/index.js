import React from 'react'
import { connect } from 'react-redux'
import { selectors } from 'data'
import { prop, path } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'

import EthereumTicker from './template.js'

const { Currencies, Currency, Pairs } = Exchange
const { ETH } = Currencies

class EthereumTickerContainer extends React.Component {
  render () {
    const { currency, ethRates } = this.props
    const CUR = prop(currency, Exchange.Currencies)
    const CURCode = prop('code', CUR)
    const CURunit = path(['units', CURCode], CUR)

    const oneETH = Currency.fromUnit({ value: '1', unit: ETH.units.ETH })
    const ethRate = oneETH.chain(Currency.convert(ethRates, CUR))
                          .chain(Currency.toUnit(CURunit))
                          .map(Currency.unitToString)
                          .getOrElse('N/A')

    return <EthereumTicker rate={ethRate} {...this.props} />
  }
}

const mapStateToProps = (state) => {
  const ethraw = selectors.core.ethRates.getEthRates(state)
  return {
    currency: selectors.core.settings.getCurrency(state),
    ethRates: Pairs.create(ETH.code, ethraw)
  }
}

export default connect(mapStateToProps)(EthereumTickerContainer)
