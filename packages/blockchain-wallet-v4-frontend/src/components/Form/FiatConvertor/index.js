import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { equals, test } from 'ramda'
import { convertFiatToCoin, convertCoinToFiat } from './conversion'

import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FiatConvertorContainer extends React.Component {
  constructor (props) {
    super(props)

    const value = this.props.input.value
    this.state = { value, fiat: undefined }

    this.handleBlur = this.handleBlur.bind(this)
    this.handleCoinChange = this.handleCoinChange.bind(this)
    this.handleFiatChange = this.handleFiatChange.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleErrorClick = this.handleErrorClick.bind(this)
    this.useMaxAvailable = this.useMaxAvailable.bind(this)
    this.useMinRequired = this.useMinRequired.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    const { coin, input, bitcoinRates, ethereumRates, bchRates } = this.props
    const { value } = input

    if (!equals(value, nextProps.input.value) ||
      (coin === 'BTC' && !equals(bitcoinRates, nextProps.bitcoinRates)) ||
      (coin === 'ETH' && !equals(ethereumRates, nextProps.ethereumRates)) ||
      (coin === 'BCH' && !equals(bchRates, nextProps.bchRates))) {
      convertFiatToCoin(nextProps.input.value, nextProps.data, nextProps.coin)
    }
  }

  update (data) {
    this.setState(data)
    this.props.input.onChange(data.value)
  }

  handleCoinChange (event) {
    event.preventDefault()
    const val = event.target.value
    const conversion = convertCoinToFiat(val, this.props.data, this.props.coin)

    this.update({ fiat: conversion.fiat, value: val })
  }

  handleFiatChange (event) {
    event.preventDefault()
    const val = event.target.value
    const conversion = convertFiatToCoin(val, this.props.data, this.props.coin)

    this.update({ fiat: val, value: conversion.coin })
  }

  handleBlur () {
    if (this.props.input.onBlur) { this.props.input.onBlur(this.state.value) }
  }

  handleFocus () {
    if (this.props.input.onFocus) { this.props.input.onFocus(this.state.value) }
  }

  handleErrorClick () {
    const err = this.props.meta.error
    if (test(/Use total available/, err)) this.useMaxAvailable()
    if (test(/The minimum amount required to send/, err)) this.useMinRequired()
  }

  useMaxAvailable () {
    const maxAvail = this.props.maxAvailable
    const conversion = convertCoinToFiat(maxAvail, this.props.data, this.props.coin)
    this.update({ value: maxAvail, fiat: conversion.fiat })
  }

  useMinRequired () {
    const minRequired = this.props.minRequired
    const conversion = convertCoinToFiat(minRequired, this.props.data, this.props.coin)
    this.update({ value: minRequired, fiat: conversion.fiat })
  }

  render () {
    const { data } = this.props
    return data.cata({
      Success: (value) => <Success
        value={this.state.value}
        fiat={this.state.fiat}
        handleBlur={this.handleBlur}
        handleCoinChange={this.handleCoinChange}
        handleFiatChange={this.handleFiatChange}
        handleFocus={this.handleFocus}
        handleErrorClick={this.handleErrorClick}
        {...this.props}
      />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

FiatConvertorContainer.propTypes = {
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired])
  }).isRequired,
  coin: PropTypes.oneOf(['BTC', 'ETH', 'BCH']).isRequired
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

export default connect(mapStateToProps)(FiatConvertorContainer)
