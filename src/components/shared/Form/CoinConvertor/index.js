import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectors } from 'data'

import { convertCoinToFiat, convertFiatToCoin } from 'services/ConversionService'
import CoinConvertor from './template.js'

class CoinConvertorContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { coinAmount: 0, fiatAmount: 0 }
    this.handleCoinChange = this.handleCoinChange.bind(this)
    this.handleCurrencyChange = this.handleCurrencyChange.bind(this)
  }

  handleCoinChange (event) {
    var newCoinValue = event.target.value
    var newFiatValue = convertCoinToFiat(newCoinValue, this.props.currency, this.props.rates).getOrElse({ amount: 0 })
    this.setState({ coinAmount: newCoinValue, fiatAmount: newFiatValue.amount })
    if (this.props.input.onChange) { this.props.input.onChange(newCoinValue) }
  }

  handleCurrencyChange (event) {
    var newFiatValue = event.target.value
    var newCoinValue = convertFiatToCoin(newFiatValue, this.props.currency, this.props.rates).getOrElse({ amount: 0 })
    this.setState({ coinAmount: newCoinValue.amount, fiatAmount: newFiatValue })
  }

  render () {
    const { unit, currency } = this.props
    console.log(this.props.input)
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
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
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
