import React from 'react'
import PropTypes from 'prop-types'
import { equals } from 'ramda'

import { convertFiatToCoin, convertCoinToFiat } from './services'
import Convertor from './template'

class ConvertorContainer extends React.PureComponent {
  state = { coin: '', fiat: '' }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!equals(nextProps.value, prevState)) {
      return nextProps.value
    }
    return null
  }

  handleCoinChange = e => {
    const {
      unit,
      currency,
      btcRates,
      bchRates,
      bsvRates,
      ethRates,
      xlmRates
    } = this.props
    const nextProps = convertCoinToFiat(
      e.target.value,
      unit,
      currency,
      bchRates,
      btcRates,
      bsvRates,
      ethRates,
      xlmRates
    )
    this.props.onChange(nextProps)
  }

  handleFiatChange = e => {
    const {
      unit,
      currency,
      btcRates,
      bchRates,
      bsvRates,
      ethRates,
      xlmRates
    } = this.props
    const decimals = e.target.value.split('.')[1]
    const needsFormatting = decimals && decimals.length > 2
    const val = needsFormatting
      ? Number(e.target.value).toFixed(2)
      : e.target.value

    const nextProps = convertFiatToCoin(
      val,
      unit,
      currency,
      bchRates,
      btcRates,
      bsvRates,
      ethRates,
      xlmRates
    )
    this.props.onChange(nextProps)
  }

  handleBlur = () => {
    this.props.onBlur(this.state)
  }

  handleFocus = () => {
    this.props.onFocus(this.state)
  }

  render () {
    const { coin, fiat } = this.state
    const {
      disabled,
      unit,
      currency,
      meta,
      errorBottom,
      className
    } = this.props

    return (
      <Convertor
        coin={coin}
        fiat={fiat}
        unit={unit}
        disabled={disabled}
        currency={currency}
        meta={meta}
        errorBottom={errorBottom}
        className={className}
        handleBlur={this.handleBlur}
        handleFocus={this.handleFocus}
        handleCoinChange={this.handleCoinChange}
        handleFiatChange={this.handleFiatChange}
        data-e2e={this.props['data-e2e']}
      />
    )
  }
}

ConvertorContainer.propTypes = {
  unit: PropTypes.oneOf(['BTC', 'ETH', 'BCH', 'BSV', 'XLM']).isRequired,
  currency: PropTypes.string.isRequired,
  btcRates: PropTypes.object.isRequired,
  bchRates: PropTypes.object.isRequired,
  bsvRates: PropTypes.object.isRequired,
  ethRates: PropTypes.object.isRequired,
  xlmRates: PropTypes.object.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
}

export default ConvertorContainer
