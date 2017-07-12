import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectors } from 'data'

import { convertCoinToCurrency, convertCurrencyToCoin } from 'services/ConversionService'
import CoinConvertor from './template.js'

class CoinConvertorContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { coinAmount: 0, currencyAmount: 0 }
    this.handleCoinChange = this.handleCoinChange.bind(this)
    this.handleCurrencyChange = this.handleCurrencyChange.bind(this)
  }

  handleCoinChange (event) {
    var newCoinValue = event.target.value
    var newCurrencyValue = convertCoinToCurrency(newCoinValue, this.props.currency, this.props.rates).getOrElse(0)
    this.setState({ coinAmount: newCoinValue, currencyAmount: newCurrencyValue })
    if (this.props.input.onChange) { this.props.input.onChange(newCoinValue) }
  }

  handleCurrencyChange (event) {
    var newCurrencyValue = event.target.value
    var newCoinValue = convertCurrencyToCoin(newCurrencyValue, this.props.currency, this.props.rates).getOrElse(0)
    this.setState({ coinAmount: newCoinValue, currencyAmount: newCurrencyValue })
  }

  render () {
    const { unit, currency } = this.props

    return <CoinConvertor
      coinValue={this.state.coinAmount}
      currencyValue={this.state.currencyAmount}
      coinUnit={unit}
      currencyUnit={currency}
      handleCoinChange={this.handleCoinChange}
      handleCurrencyChange={this.handleCurrencyChange}
    />
  }
}

CoinConvertorContainer.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
  })
}

CoinConvertorContainer.defaultProps = {

}

const mapStateToProps = (state) => ({
  unit: selectors.core.settings.getBtcCurrency(state),
  currency: selectors.core.settings.getCurrency(state),
  rates: selectors.core.rates.getRates(state)
})

export default connect(mapStateToProps)(CoinConvertorContainer)
