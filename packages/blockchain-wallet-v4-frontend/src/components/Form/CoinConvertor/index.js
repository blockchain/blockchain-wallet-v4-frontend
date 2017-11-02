import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectors } from 'data'

class CoinConvertorContainer extends React.Component {
  render () {
    return <div />
  }
}

CoinConvertorContainer.propTypes = {
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired])
  }).isRequired,
  coin: PropTypes.oneOf(['BTC', 'ETH']).isRequired
}

const mapStateToProps = (state) => ({
  unit: selectors.core.settings.getBtcUnit(state),
  currency: selectors.core.settings.getCurrency(state),
  bitcoinRates: selectors.core.data.bitcoin.getRates(state),
  ethereumRates: selectors.core.data.ethereum.getRates(state)
})

export default connect(mapStateToProps)(CoinConvertorContainer)
