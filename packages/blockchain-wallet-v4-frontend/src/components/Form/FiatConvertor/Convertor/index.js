import React from 'react'
import PropTypes from 'prop-types'
import { equals } from 'ramda'

import { convertFiatToCoin, convertCoinToFiat } from './services'
import Convertor from './template'

class ConvertorContainer extends React.PureComponent {
  static getDerivedStateFromProps (nextProps, prevState) {
    if (!equals(nextProps.value, prevState)) {
      return nextProps.value
    }
    return null
  }

  constructor (props) {
    super(props)
    this.state = { coin: '', fiat: '' }
    this.handleCoinChange = this.handleCoinChange.bind(this)
    this.handleFiatChange = this.handleFiatChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
  }

  handleCoinChange (e) {
    const { unit, currency, btcRates, bchRates, ethRates } = this.props
    const nextProps = convertCoinToFiat(e.target.value, unit, currency, bchRates, btcRates, ethRates)
    this.props.onChange(nextProps)
  }

  handleFiatChange (e) {
    const { unit, currency, btcRates, bchRates, ethRates } = this.props
    const nextProps = convertFiatToCoin(e.target.value, unit, currency, bchRates, btcRates, ethRates)
    this.props.onChange(nextProps)
  }

  handleBlur () {
    this.props.onBlur(this.state)
  }

  handleFocus () {
    this.props.onFocus(this.state)
  }

  render () {
    const { coin, fiat } = this.state
    const { disabled, unit, currency, meta } = this.props

    return <Convertor
      coin={coin}
      fiat={fiat}
      unit={unit}
      disabled={disabled}
      currency={currency}
      meta={meta}
      handleBlur={this.handleBlur}
      handleFocus={this.handleFocus}
      handleCoinChange={this.handleCoinChange}
      handleFiatChange={this.handleFiatChange}
    />
  }
}

ConvertorContainer.propTypes = {
  unit: PropTypes.oneOf(['BTC', 'ETH', 'BCH']).isRequired,
  currency: PropTypes.string.isRequired,
  btcRates: PropTypes.object.isRequired,
  bchRates: PropTypes.object.isRequired,
  ethRates: PropTypes.object.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
}

export default ConvertorContainer
