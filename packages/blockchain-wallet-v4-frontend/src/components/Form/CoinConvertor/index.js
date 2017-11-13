import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { actions, selectors } from 'data'
import { isEmpty } from 'ramda'
import { bindActionCreators } from 'redux'

import { Exchange } from 'blockchain-wallet-v4/src'
import CoinConvertor from './template.js'

class CoinConvertorContainer extends React.Component {
  constructor (props) {
    super(props)

    const value = this.props.input.value || 0
    this.state = { value, toValue: '0' }

    this.handleBlur = this.handleBlur.bind(this)
    this.handleFromCoinChange = this.handleFromCoinChange.bind(this)
    this.handleToCoinChange = this.handleToCoinChange.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
  }

  componentWillMount () {
    if (isEmpty(this.props.btcEth)) {
      this.props.dataActions.getBtcEth()
    }
    if (isEmpty(this.props.ethBtc)) {
      this.props.dataActions.getEthBtc()
    }
  }

  handleFromCoinChange (event) {
    this.convertCoin(event.target.value, true)
    if (this.props.input.onChange) { this.props.input.onChange(event.target.value) }
  }

  handleToCoinChange (event) {
    this.convertCoin(event.target.value, false)
  }

  handleBlur () {
    if (this.props.input.onBlur) { this.props.input.onBlur(this.state.value) }
  }

  handleFocus () {
    if (this.props.input.onFocus) { this.props.input.onFocus(this.state.value) }
  }

  convertCoin (value, valueIsFrom) {
    const { fromCoin, btcUnit, ethUnit, btcEth, ethBtc } = this.props
    const conversion = fromCoin === 'BTC'
      ? Exchange.convertBitcoinToEther({ value: value, fromUnit: btcUnit, toUnit: ethUnit, rate: btcEth.rate, reverse: !valueIsFrom })
      : Exchange.convertEtherToBitcoin({ value: value, fromUnit: ethUnit, toUnit: btcUnit, rate: ethBtc.rate, reverse: !valueIsFrom })

    valueIsFrom ? this.setState({ value: value, toValue: conversion.value })
      : this.setState({ value: conversion.value, toValue: value })
  }

  render () {
    return <CoinConvertor
      value={this.state.value}
      toValue={this.state.toValue}
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
  btcEth: selectors.core.data.shapeShift.getBtcEth(state),
  ethBtc: selectors.core.data.shapeShift.getEthBtc(state)
})

const mapDispatchToProps = (dispatch) => ({
  dataActions: bindActionCreators(actions.data, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CoinConvertorContainer)
