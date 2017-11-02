import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectors } from 'data'
import { equals } from 'ramda'

import { Exchange } from 'blockchain-wallet-v4/src'
import FiatConvertor from './template.js'

class FiatConvertorContainer extends React.Component {
  constructor (props) {
    super(props)

    const value = this.props.input.value
    this.state = { value, fiat: undefined }

    this.handleBlur = this.handleBlur.bind(this)
    this.handleCoinChange = this.handleCoinChange.bind(this)
    this.handleFiatChange = this.handleFiatChange.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    const { coin, input, bitcoinRates, ethereumRates } = this.props
    const { value } = input

    if (!equals(value, nextProps.input.value) ||
      (coin === 'BTC' && !equals(bitcoinRates, nextProps.bitcoinRates)) ||
      (coin === 'ETH' && !equals(ethereumRates, nextProps.ethereumRates))) {
      this.convertFiat(nextProps.input.value)
    }
  }

  handleCoinChange (event) {
    this.convertFiat(event.target.value)
    if (this.props.input.onChange) { this.props.input.onChange(event.target.value) }
  }

  handleFiatChange (event) {
    this.convertCoin(event.target.value)
  }

  handleBlur () {
    if (this.props.input.onBlur) { this.props.input.onBlur(this.state.value) }
  }

  handleFocus () {
    if (this.props.input.onFocus) { this.props.input.onFocus(this.state.value) }
  }

  convertCoin (value) {
    const { coin, unit, currency, bitcoinRates, ethereumRates } = this.props

    const conversion = coin === 'BTC'
      ? Exchange.convertFiatToBitcoin({ value: value, fromCurrency: currency, toUnit: unit, rates: bitcoinRates })
      : Exchange.convertFiatToEther({ value: value, fromCurrency: currency, toUnit: unit, rates: ethereumRates })
    this.setState({ value: conversion.value, fiat: value })
  }

  convertFiat (value) {
    const { coin, unit, currency, bitcoinRates, ethereumRates } = this.props

    const conversion = coin === 'BTC'
      ? Exchange.convertBitcoinToFiat({ value: value, fromUnit: unit, toCurrency: currency, rates: bitcoinRates })
      : Exchange.convertEtherToFiat({ value: value, fromUnit: unit, toCurrency: currency, rates: ethereumRates })
    this.setState({ value: value, fiat: conversion.value })
  }

  render () {
    const { coin, currency, ...rest } = this.props
    const unit = coin === 'BTC' ? this.props.unit : 'ETH'

    return <FiatConvertor
      value={this.state.value}
      fiat={this.state.fiat}
      unit={unit}
      currency={currency}
      handleBlur={this.handleBlur}
      handleCoinChange={this.handleCoinChange}
      handleFiatChange={this.handleFiatChange}
      handleFocus={this.handleFocus}
      {...rest}
    />
  }
}

FiatConvertorContainer.propTypes = {
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

export default connect(mapStateToProps)(FiatConvertorContainer)
