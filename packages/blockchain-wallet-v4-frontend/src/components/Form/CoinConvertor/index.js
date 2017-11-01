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
    // const { coin, unit, currency, bitcoinRates, ethereumRates } = props
    // const conversion = coin === 'BTC'
    //   ? Exchange.convertBitcoinToFiat({ value: this.props.input.value, fromUnit: unit, toCurrency: currency, rates: bitcoinRates })
    //   : Exchange.convertEtherToFiat({ value: this.props.input.value, fromUnit: unit, toCurrency: currency, rates: ethereumRates })

    // this.state = {
    //   coin: this.props.input.value,
    //   coinUnit: unit,
    //   fiat: conversion.value,
    //   fiatUnit: currency
    // }

    // this.handleBlur = this.handleBlur.bind(this)
    // this.handleCoinChange = this.handleCoinChange.bind(this)
    // this.handleFiatChange = this.handleFiatChange.bind(this)
    // this.handleFocus = this.handleFocus.bind(this)
  }

  // componentWillReceiveProps (nextProps) {
  //   if (!equals(this.props.input.value, nextProps.input.value ||
  //       !equals(this.props.rates, nextProps.rates) ||
  //       !equals(this.props.unit, nextProps.unit) ||
  //       !equals(this.props.currency, nextProps.currency))) {
  //     const { coin, unit, currency, bitcoinRates, ethereumRates } = nextProps
  //     const value = nextProps.input.value
  //     const conversion = coin === 'BTC'
  //       ? Exchange.convertBitcoinToFiat({ value: this.props.input.value, fromUnit: unit, toCurrency: currency, rates: bitcoinRates })
  //       : Exchange.convertEtherToFiat({ value: this.props.input.value, fromUnit: unit, toCurrency: currency, rates: ethereumRates })

  //     this.setState({
  //       coin: value,
  //       coinUnit: unit,
  //       fiat: conversion.value,
  //       fiatUnit: currency
  //     })
  //   }
  // }

  // handleCoinChange (event) {
  //   const { coin, unit, currency, bitcoinRates, ethereumRates } = this.props
  //   const value = event.target.value
  //   const conversion = coin === 'BTC'
  //     ? Exchange.convertBitcoinToFiat({ value: this.props.input.value, fromUnit: unit, toCurrency: currency, rates: bitcoinRates })
  //     : Exchange.convertEtherToFiat({ value: this.props.input.value, fromUnit: unit, toCurrency: currency, rates: ethereumRates })

  //   this.setState({
  //     coin: value,
  //     coinUnit: unit,
  //     fiat: conversion.value,
  //     fiatUnit: currency
  //   })

  //   if (this.props.input.onChange) { this.props.input.onChange(value) }
  // }

  // handleFiatChange (event) {
  //   const { coin, unit, currency, bitcoinRates, ethereumRates } = this.props
  //   const value = event.target.value
  //   const conversion = coin === 'BTC'
  //     ? Exchange.convertFiatToBitcoin({ value: value, fromCurrency: currency, toUnit: unit, rates: bitcoinRates })
  //     : Exchange.convertFiatToEther({ value: value, fromCurrency: currency, toUnit: unit, rates: ethereumRates })

  //   this.setState({
  //     coin: conversion.value,
  //     coinUnit: unit,
  //     fiat: value,
  //     fiatUnit: currency
  //   })
  // }

  // handleBlur () {
  //   if (this.props.input.onBlur) { this.props.input.onBlur(this.state.coin) }
  // }

  // handleFocus () {
  //   if (this.props.input.onFocus) { this.props.input.onFocus(this.state.coin) }
  // }

  render () {
    const { unit, currency, ...rest } = this.props

    // return <CoinConvertor
    //   coinValue={this.state.coin}
    //   fiatValue={this.state.fiat}
    //   coinUnit={this.state.coinUnit}
    //   fiatUnit={this.state.fiatUnit}
    //   handleBlur={this.handleBlur}
    //   handleCoinChange={this.handleCoinChange}
    //   handleFiatChange={this.handleFiatChange}
    //   handleFocus={this.handleFocus}
    //   {...rest}
    // />
    return <div />
  }
}

CoinConvertorContainer.propTypes = {
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired])
  }).isRequired
  // coin: PropTypes.oneOf(['BTC', 'ETH']).isRequired
}

const mapStateToProps = (state) => ({
  unit: selectors.core.settings.getBtcUnit(state),
  currency: selectors.core.settings.getCurrency(state),
  bitcoinRates: selectors.core.data.bitcoin.getRates(state),
  ethereumRates: selectors.core.data.ethereum.getRates(state)
})

export default connect(mapStateToProps)(CoinConvertorContainer)
