import React from 'react'
import { connect } from 'react-redux'
import { selectors } from 'data'
import { prop, path } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'

import BitcoinTicker from './template.js'

const { Currencies, Currency, Pairs } = Exchange
const { BTC } = Currencies

class BitcoinTickerContainer extends React.Component {
  render () {
    const { currency, btcRates } = this.props
    const CUR = prop(currency, Exchange.Currencies)
    const CURCode = prop('code', CUR)
    const CURunit = path(['units', CURCode], CUR)

    const oneBTC = Currency.fromUnit({ value: '1', unit: BTC.units.BTC })
    const btcRate = oneBTC.chain(Currency.convert(btcRates, CUR))
                          .chain(Currency.toUnit(CURunit))
                          .map(Currency.unitToString)
                          .getOrElse('N/A')

    return <BitcoinTicker rate={btcRate} {...this.props} />
  }
}

const mapStateToProps = (state) => {
  const btcraw = selectors.core.btcRates.getBtcRates(state)
  return {
    currency: selectors.core.settings.getCurrency(state),
    btcRates: Pairs.create(BTC.code, btcraw)
  }
}

export default connect(mapStateToProps)(BitcoinTickerContainer)
