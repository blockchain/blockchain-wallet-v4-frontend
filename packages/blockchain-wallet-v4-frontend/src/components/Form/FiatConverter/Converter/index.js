import React from 'react'
import PropTypes from 'prop-types'
import { equals } from 'ramda'

import { Exchange } from 'blockchain-wallet-v4/src'

import Converter from './template'

const convertFiatToCoin = (unit, value, currency, rates) => ({
  coin: Exchange.convertFiatToCoin({ coin: unit, currency, maxPrecision: 8, rates, value }),
  coinCode: unit,
  fiat: value
})

const convertCoinToFiat = (unit, value, currency, rates) => ({
  coin: value,
  coinCode: unit,
  fiat: Exchange.convertCoinToFiat({ coin: unit, currency, isStandard: true, rates, value })
})

class ConverterContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { coin: '', fiat: '' }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!equals(nextProps.value, prevState)) {
      return nextProps.value
    }
    return null
  }

  handleCoinChange = (e) => {
    const { currency, rates, unit } = this.props
    const nextProps = convertCoinToFiat(unit, e.target.value, currency, rates)
    this.props.onChange(nextProps)
  }

  handleFiatChange = (e) => {
    const { currency, rates, unit } = this.props
    const decimals = e.target.value.split('.')[1]
    const needsFormatting = decimals && decimals.length > 2
    const val = needsFormatting ? Number(e.target.value).toFixed(2) : e.target.value

    const nextProps = convertFiatToCoin(unit, val, currency, rates)
    this.props.onChange(nextProps)
  }

  handleBlur = () => {
    this.props.onBlur(this.state)
  }

  handleFocus = () => {
    this.props.onFocus(this.state)
  }

  render() {
    const { coin, fiat } = this.state
    const {
      className,
      coinTicker,
      currency,
      disabled,
      errorBottom,
      marginTop,
      meta,
      unit
    } = this.props
    return (
      <Converter
        coin={coin}
        coinTicker={coinTicker}
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
        marginTop={marginTop}
      />
    )
  }
}

ConverterContainer.propTypes = {
  currency: PropTypes.string.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  rates: PropTypes.object.isRequired,
  unit: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
}

export default ConverterContainer
