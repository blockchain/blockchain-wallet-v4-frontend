import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectors } from 'data'

import { convertCoinToFiat, convertFiatToCoin, convertToUnit, convertFromUnit } from 'services/ConversionService'
import CoinConvertor from './template.js'

class CoinConvertorContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { coinAmount: 0, fiatAmount: 0 }
    this.handleCoinChange = this.handleCoinChange.bind(this)
    this.handleFiatChange = this.handleFiatChange.bind(this)
  }

  handleCoinChange (event) {
    var newCoinValue = parseFloat(event.target.value)
    var newCoinValueTransformed = convertFromUnit(this.props.coin, newCoinValue, this.props.unit).getOrElse({ amount: 0 })
    var newFiatValue = convertCoinToFiat(this.props.coin, newCoinValueTransformed.amount, this.props.currency, this.props.rates).getOrElse({ amount: 0 })
    this.setState({ coinAmount: newCoinValue, fiatAmount: newFiatValue.amount })
    if (this.props.input.onChange) { this.props.input.onChange(newCoinValue) }
  }

  handleFiatChange (event) {
    var newFiatValue = parseFloat(event.target.value)
    var newCoinValue = convertFiatToCoin(this.props.coin, newFiatValue, this.props.currency, this.props.rates).getOrElse({ amount: 0 })
    var newCoinValueTransformed = convertToUnit(this.props.coin, newCoinValue.amount, this.props.unit).getOrElse({ amount: 0 })
    this.setState({ coinAmount: newCoinValueTransformed.amount, fiatAmount: newFiatValue })
  }

  render () {
    const { unit, currency } = this.props

    return <CoinConvertor
      coinValue={this.state.coinAmount}
      fiatValue={this.state.fiatAmount}
      coinUnit={unit}
      fiatUnit={currency}
      handleCoinChange={this.handleCoinChange}
      handleFiatChange={this.handleFiatChange}
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

const mapStateToProps = (state) => ({
  coin: 'bitcoin',
  unit: selectors.core.settings.getBtcCurrency(state),
  currency: selectors.core.settings.getCurrency(state),
  rates: selectors.core.rates.getRates(state)
})

export default connect(mapStateToProps)(CoinConvertorContainer)
