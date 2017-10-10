import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectors } from 'data'
import { equals, prop, path } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'

import { convertUnitToFiat, convertFiatToUnit } from 'services/ConversionService'
import CoinConvertor from './template.js'

const { Currencies } = Exchange
const { BTC } = Currencies

class CoinConvertorContainer extends React.Component {
  constructor (props) {
    super(props)
    const { unit, currency, rates, input } = props
    const { value } = input
    const coin = value
    const fiat = convertUnitToFiat(unit, currency, rates, coin)

    this.state = {
      coin,
      coinUnit: BTC.units[unit].symbol,
      fiat: fiat.value,
      fiatUnit: fiat.unit.symbol
    }

    this.handleBlur = this.handleBlur.bind(this)
    this.handleCoinChange = this.handleCoinChange.bind(this)
    this.handleFiatChange = this.handleFiatChange.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(this.props.input.value, nextProps.input.value ||
        !equals(this.props.rates, nextProps.rates) ||
        !equals(this.props.unit, nextProps.unit) ||
        !equals(this.props.currency, nextProps.currency))) {
      const { unit, currency, rates } = nextProps
      const coin = nextProps.input.value
      const fiat = convertUnitToFiat(unit, currency, rates, coin)

      this.setState({
        coin,
        coinUnit: BTC.units[unit].symbol,
        fiat: fiat.value,
        fiatUnit: fiat.unit ? fiat.unit.symbol : ''
      })
    }
  }

  handleCoinChange (event) {
    const { unit, currency, rates, input } = this.props
    const { onChange } = input
    const value = event.target.value
    const coin = value
    const fiat = convertUnitToFiat(unit, currency, rates, coin)

    this.setState({
      coin,
      coinUnit: BTC.units[unit].symbol,
      fiat: fiat.value,
      fiatUnit: fiat.unit.symbol
    })

    if (onChange) { onChange(value) }
  }

  handleFiatChange (event) {
    const { unit, currency, rates } = this.props
    const value = event.target.value
    const fiat = value
    const coin = convertFiatToUnit(unit, currency, rates, fiat)
    const CUR = prop(currency, Currencies)
    const CURCode = prop('code', CUR)
    const CURunit = path(['units', CURCode], CUR)

    this.setState({
      coin: coin.value,
      coinUnit: coin.unit.symbol,
      fiat: fiat,
      fiatUnit: CURunit.symbol
    })
  }

  handleBlur () {
    const { input } = this.props
    const { onBlur } = input
    if (onBlur) { onBlur(this.state.coin) }
  }

  handleFocus () {
    const { input } = this.props
    const { onFocus } = input
    if (onFocus) { onFocus(this.state.coin) }
  }

  render () {
    const { unit, currency, ...rest } = this.props

    return <CoinConvertor
      coinValue={this.state.coin}
      fiatValue={this.state.fiat}
      coinUnit={this.state.coinUnit}
      fiatUnit={this.state.fiatUnit}
      handleBlur={this.handleBlur}
      handleCoinChange={this.handleCoinChange}
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
  unit: selectors.core.settings.getBtcUnit(state),
  currency: selectors.core.settings.getCurrency(state),
  rates: selectors.core.rates.getBtcRates(state)
})

export default connect(mapStateToProps)(CoinConvertorContainer)
