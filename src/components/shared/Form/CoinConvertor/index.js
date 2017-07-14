import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectors } from 'data'

import { convertCoinToFiat, convertFiatToCoin, convertToUnit, convertFromUnit } from 'services/ConversionService'
import CoinConvertor from './template.js'

class CoinConvertorContainer extends React.Component {
  constructor (props) {
    super(props)
    const { input } = props
    const { value } = input

    this.state = { coinAmount: value }
    this.handleCoinChange = this.handleCoinChange.bind(this)
    this.handleFiatChange = this.handleFiatChange.bind(this)
  }

  handleCoinChange (event) {
    const { coin, unit, currency, rates, input } = this.props
    const { onChange } = input

    const newCoinValue = parseFloat(event.target.value)
    const newCoinValueTransformed = convertFromUnit(coin, newCoinValue, unit).getOrElse({ amount: 0 })
    const newFiatValue = convertCoinToFiat(coin, newCoinValueTransformed.amount, currency, rates).getOrElse({ amount: 0 })
    this.setState({ coinAmount: newCoinValue, fiatAmount: newFiatValue.amount })
    if (onChange) { onChange(newCoinValue) }
  }

  handleFiatChange (event) {
    const { coin, unit, currency, rates } = this.props

    const newFiatValue = parseFloat(event.target.value)
    const newCoinValue = convertFiatToCoin(coin, newFiatValue, currency, rates).getOrElse({ amount: 0 })
    const newCoinValueTransformed = convertToUnit(coin, newCoinValue.amount, unit).getOrElse({ amount: 0 })
    this.setState({ coinAmount: newCoinValueTransformed.amount, fiatAmount: newFiatValue })
  }

  render () {
    const { unit, currency, ...rest } = this.props

    return <CoinConvertor
      coinValue={this.state.coinAmount}
      fiatValue={this.state.fiatAmount}
      coinUnit={unit}
      fiatUnit={currency}
      handleCoinChange={this.handleCoinChange}
      handleFiatChange={this.handleFiatChange}
      {...rest}
    />
  }
}

CoinConvertorContainer.propTypes = {
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
  }).isRequired
}

const mapStateToProps = (state) => ({
  coin: 'bitcoin',
  unit: selectors.core.settings.getBtcCurrency(state),
  currency: selectors.core.settings.getCurrency(state),
  rates: selectors.core.rates.getRates(state)
})

export default connect(mapStateToProps)(CoinConvertorContainer)
