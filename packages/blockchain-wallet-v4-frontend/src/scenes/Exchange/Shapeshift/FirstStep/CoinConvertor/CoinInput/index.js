import React from 'react'
import PropTypes from 'prop-types'

import { equals } from 'ramda'
import { convertCoinToFiat, convertFiatToCoin } from './services'
import CoinInput from './template'

class CoinInputContainer extends React.Component {
  constructor (props) {
    super(props)
    const { coinName, coin, currency, btcRates, ethRates } = this.props
    const fiat = convertCoinToFiat(coin, coinName, coinName, currency, btcRates, ethRates)
    this.state = { coin, fiat }
    this.handleChangeCoin = this.handleChangeCoin.bind(this)
    this.handleChangeFiat = this.handleChangeFiat.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    // Update state if coin value has changed
    const { coinName, coin, currency, btcRates, ethRates } = nextProps
    // console.log('componentWillReceiveProps', this.props.coin, nextProps.coin, this.props.coinName, nextProps.coinName)
    if (!equals(this.props.coin, coin) || !equals(this.props.coinName, coinName)) {
      const fiat = convertCoinToFiat(coin, coinName, coinName, currency, btcRates, ethRates)
      this.setState({ coin, fiat })
    }
  }

  handleChangeCoin (e) {
    const coin = e.target.value
    const { coinName, currency, btcRates, ethRates } = this.props
    const fiat = convertCoinToFiat(coin, coinName, coinName, currency, btcRates, ethRates)
    this.setState({ coin, fiat })
    this.props.handleChange(coin)
  }

  handleChangeFiat (e) {
    const fiat = e.target.value
    const { coinName, currency, btcRates, ethRates } = this.props
    const coin = convertFiatToCoin(fiat, coinName, coinName, currency, btcRates, ethRates)
    this.setState({ coin, fiat })
    this.props.handleChange(coin)
  }

  render () {
    const { coinName, currency, disabled, errorState, handleBlur, handleFocus } = this.props
    const { coin, fiat } = this.state

    return <CoinInput
      coinValue={coin}
      fiatValue={fiat}
      coinUnit={coinName}
      fiatUnit={currency}
      disabled={disabled}
      handleChangeCoin={this.handleChangeCoin}
      handleChangeFiat={this.handleChangeFiat}
      handleBlur={handleBlur}
      handleFocus={handleFocus}
      errorState={errorState}
    />
  }
}

CoinInputContainer.propTypes = {
  coinName: PropTypes.oneOf(['BTC', 'ETH', 'BCH']).isRequired,
  coin: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  bchRates: PropTypes.object,
  btcRates: PropTypes.object,
  ethRates: PropTypes.object,
  disabled: PropTypes.bool,
  handleChange: PropTypes.func
}

CoinInputContainer.defaultProps = {
  disabled: false
}

export default CoinInputContainer
