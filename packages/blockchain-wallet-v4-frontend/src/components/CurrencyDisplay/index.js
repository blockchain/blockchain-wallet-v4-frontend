import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { convertBaseCoinToFiat, displayWeiToFiat } from 'services/ConversionService'
import { selectors } from 'data'

const CurrencyDisplay = props => {
  const { currency, bitcoinRates, ethereumRates, coin, children } = props
  const amount = children || '0'
  return (
    <div>
      { coin === 'BTC'
        ? convertBaseCoinToFiat(currency, bitcoinRates, amount)
        : displayWeiToFiat(currency, ethereumRates, amount)
      }
    </div>
  )
}

CurrencyDisplay.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'ETH']).isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

CurrencyDisplay.defaultProps = {
  children: 0
}

const mapStateToProps = (state) => ({
  currency: selectors.core.settings.getCurrency(state),
  bitcoinRates: selectors.core.data.rates.getBtcRates(state),
  ethereumRates: selectors.core.data.rates.getEthRates(state)
})

export default connect(mapStateToProps)(CurrencyDisplay)
