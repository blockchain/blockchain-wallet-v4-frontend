import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectors } from 'data'

import { convertCoinToFiat, convertFiatToCoin, convertToUnit, convertFromUnit, getDecimals, getSymbol } from 'services/ConversionService'
import CoinConvertor from './template.js'

class CoinConvertorContainer extends React.Component {
  constructor (props) {
    super(props)
    const { network, unit, currency, rates, input } = props
    const { value } = input

    const initialCoinValue = value ? parseFloat(value) : 0
    const initialCoinValueTransformed = convertFromUnit(network, initialCoinValue, unit).getOrElse({ amount: 0 })
    const initialFiatValue = convertCoinToFiat(network, initialCoinValueTransformed.amount, currency, rates).getOrElse({ amount: 0 })

    this.state = { value: initialCoinValue, coin: initialCoinValue, fiat: initialFiatValue.amount }

    this.handleBlur = this.handleBlur.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleFiatChange = this.handleFiatChange.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
  }

  handleChange (event) {
    const { network, unit, currency, rates, decimals, input } = this.props
    const { onChange } = input

    const split = event.target.value.split('.')
    if (split.length > 1 && split[1].length > decimals) return

    const newCoinValue = parseFloat(event.target.value)
    const newCoinValueTransformed = convertFromUnit(network, newCoinValue, unit).getOrElse({ amount: 0 })
    const newFiatValue = convertCoinToFiat(network, newCoinValueTransformed.amount, currency, rates).getOrElse({ amount: 0 })
    const newFiatValueFormatted = parseFloat(newFiatValue.amount.toFixed(2))
    this.setState({ value: newCoinValue, coin: newCoinValue, fiat: newFiatValueFormatted })

    if (onChange) { onChange(newCoinValue) }
  }

  handleFiatChange (event) {
    const { network, unit, currency, rates, decimals, input } = this.props
    const { onChange } = input

    const split = event.target.value.split('.')
    if (split.length > 1 && split[1].length > 2) return

    const newFiatValue = parseFloat(event.target.value)
    const newCoinValue = convertFiatToCoin(network, newFiatValue, currency, rates).getOrElse({ amount: 0 })
    const newCoinValueTransformed = convertToUnit(network, newCoinValue.amount, unit).getOrElse({ amount: 0 })
    const newCoinValueFormatted = parseFloat(newCoinValueTransformed.amount.toFixed(decimals))
    this.setState({ value: newCoinValueFormatted, coin: newCoinValueFormatted, fiat: newFiatValue })

    if (onChange) { onChange(newCoinValueTransformed.amount) }
  }

  handleBlur () {
    const { input } = this.props
    const { onBlur } = input
    if (onBlur) { onBlur(this.state.value) }
  }

  handleFocus () {
    const { input } = this.props
    const { onFocus } = input
    if (onFocus) { onFocus() }
  }

  render () {
    const { network, unit, currency, ...rest } = this.props
    const coinSymbol = getSymbol(network, unit)

    return <CoinConvertor
      coinValue={this.state.coin}
      fiatValue={this.state.fiat}
      coinUnit={coinSymbol}
      fiatUnit={currency}
      handleBlur={this.handleBlur}
      handleChange={this.handleChange}
      handleFiatChange={this.handleFiatChange}
      handleFocus={this.handleFocus}
      {...rest}
    />
  }
}

CoinConvertorContainer.propTypes = {
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired])
  }).isRequired
}

const mapStateToProps = (state) => ({
  network: 'bitcoin',
  unit: selectors.core.settings.getBtcCurrency(state),
  currency: selectors.core.settings.getCurrency(state),
  rates: selectors.core.rates.getRates(state),
  decimals: getDecimals('bitcoin', selectors.core.settings.getBtcCurrency(state))
})

export default connect(mapStateToProps)(CoinConvertorContainer)
