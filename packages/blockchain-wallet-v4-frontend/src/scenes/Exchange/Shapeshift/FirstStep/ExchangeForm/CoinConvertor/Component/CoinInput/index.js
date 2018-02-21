import React from 'react'
import PropTypes from 'prop-types'

import { convertCoinToFiat, convertFiatToCoin } from './services'
import CoinInput from './template'

class CoinInputContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { coinValue: this.props.coinValue, fiatValue: '' }
    this.handleChangeCoin = this.handleChangeCoin.bind(this)
    this.handleChangeFiat = this.handleChangeFiat.bind(this)
  }

  update (value) {
    this.setState(value)
    this.props.handleChange(value.coinValue)
  }

  handleChangeCoin (e) {
    const coinValue = e.target.value
    const { coin, coinUnit, currency, btcRates, ethRates } = this.props
    console.log('handleChangeCoin', coin, coinUnit, currency, btcRates, ethRates)
    const fiatValue = convertCoinToFiat(coinValue, coin, coinUnit, currency, btcRates, ethRates)
    console.log('handleChangeCoin', coinValue, fiatValue)
    this.update({ coinValue, fiatValue })
  }

  handleChangeFiat (e) {
    const fiatValue = e.target.value
    const { coin, coinUnit, currency, btcRates, ethRates } = this.props
    const coinValue = convertFiatToCoin(fiatValue, coin, coinUnit, currency, btcRates, ethRates)
    console.log('handleChangeFiat', coinValue, fiatValue)
    this.update({ coinValue, fiatValue })
  }

  render () {
    const { coinUnit, currency, disabled } = this.props
    const { coinValue, fiatValue } = this.state

    return <CoinInput
      coinValue={coinValue}
      fiatValue={fiatValue}
      coinUnit={coinUnit}
      fiatUnit={currency}
      disabled={disabled}
      handleChangeCoin={this.handleChangeCoin}
      handleChangeFiat={this.handleChangeFiat}
    />
  }
}

CoinInputContainer.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'ETH', 'BCH']).isRequired,
  coinValue: PropTypes.string.isRequired,
  coinUnit: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  btcRates: PropTypes.object.isRequired,
  ethRates: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  handleChange: PropTypes.func.isRequired
}

CoinInputContainer.defaultProps = {
  disabled: false
}

export default CoinInputContainer
