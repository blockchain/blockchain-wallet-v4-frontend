import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectors } from 'data'
import { equals } from 'ramda'

import { Exchange } from 'blockchain-wallet-v4/src'
import CoinConvertor from './template.js'

class CoinConvertorContainer extends React.Component {
  constructor (props) {
    super(props)

    const value = this.props.input.value || 0
    this.state = { value, toValue: 0, fromValueFiat: 0, toValueFiat: 0 }

    this.handleBlur = this.handleBlur.bind(this)
    this.handleFromCoinChange = this.handleFromCoinChange.bind(this)
    this.handleToCoinChange = this.handleToCoinChange.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    const { fromCoin, input, btcEthRates, ethBtcRates } = this.props
    const { value } = input

    if (!equals(value, nextProps.input.value) ||
      (fromCoin === 'BTC' && !equals(btcEthRates, nextProps.btcEthRates)) ||
      (fromCoin === 'ETH' && !equals(ethBtcRates, nextProps.ethBtcRates))) {
      this.convertAll(nextProps.input.value, true)
    }
  }

  handleFromCoinChange (event) {
    this.convertAll(event.target.value, true)
    if (this.props.input.onChange) { this.props.input.onChange(event.target.value) }
  }

  handleToCoinChange (event) {
    this.convertAll(event.target.value, false)
  }

  handleBlur () {
    if (this.props.input.onBlur) { this.props.input.onBlur(this.state.value) }
  }

  handleFocus () {
    if (this.props.input.onFocus) { this.props.input.onFocus(this.state.value) }
  }

  convertAll (value, valueIsFrom) {
    const { fromCoin, btcUnit, ethUnit, btcEthRates, ethBtcRates } = this.props
    const fromCoinIsBtc = fromCoin === 'BTC'
    const valueIsBtc = (fromCoinIsBtc && valueIsFrom) || (!fromCoinIsBtc && !valueIsFrom)

    const conversion = fromCoinIsBtc
      ? Exchange.convertBitcoinToEther({ value: value, fromUnit: btcUnit, toUnit: ethUnit, rates: btcEthRates })
      : Exchange.convertEtherToBitcoin({ value: value, fromUnit: ethUnit, toUnit: btcUnit, rates: ethBtcRates })

    const valueFiat = this.convertFiat(value, valueIsBtc)
    const conversionValueFiat = this.convertFiat(conversion.value, !valueIsBtc)

    valueIsFrom ? this.setState({ value: value, toValue: conversion.value, fromValueFiat: valueFiat, toValueFiat: conversionValueFiat })
      : this.setState({ value: conversion.value, toValue: value, fromValueFiat: conversionValueFiat, toValueFiat: valueFiat })
  }

  convertFiat (value, fromBtc) {
    const { btcUnit, ethUnit, currency, bitcoinRates, ethereumRates } = this.props

    const fiat = fromBtc
      ? Exchange.displayBitcoinToFiat({ value: value, fromUnit: btcUnit, toCurrency: currency, rates: bitcoinRates })
      : Exchange.displayEtherToFiat({ value: value, fromUnit: ethUnit, toCurrency: currency, rates: ethereumRates })

    return fiat
  }

  render () {
    return <CoinConvertor
      value={this.state.value}
      toValue={this.state.toValue}
      fromValueFiat={this.state.fromValueFiat}
      toValueFiat={this.state.toValueFiat}
      handleBlur={this.handleBlur}
      handleFromCoinChange={this.handleFromCoinChange}
      handleToCoinChange={this.handleToCoinChange}
      handleFocus={this.handleFocus}
      {...this.props}
    />
  }
}

CoinConvertorContainer.propTypes = {
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired])
  }).isRequired,
  fromCoin: PropTypes.oneOf(['BTC', 'ETH']).isRequired,
  toCoin: PropTypes.oneOf(['BTC', 'ETH']).isRequired
}

const mapStateToProps = (state) => ({
  btcUnit: selectors.core.settings.getBtcUnit(state),
  ethUnit: 'ETH',
  currency: selectors.core.settings.getCurrency(state),
  bitcoinRates: selectors.core.data.bitcoin.getRates(state),
  ethereumRates: selectors.core.data.ethereum.getRates(state),
  btcEthRates: 0,
  ethBtcRates: 0
})

export default connect(mapStateToProps)(CoinConvertorContainer)
