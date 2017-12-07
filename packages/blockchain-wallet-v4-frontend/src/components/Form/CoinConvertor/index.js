import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isEmpty } from 'ramda'

import { actions, selectors } from 'data'
import { Exchange } from 'blockchain-wallet-v4/src'
import CoinConvertor from './template.js'

class CoinConvertorContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      coin1: this.props.input.value || '',
      coin2: '',
      fiat1: '',
      fiat2: ''
    }

    this.handleChangeCoin1 = this.handleChangeCoin1.bind(this)
    this.handleChangeCoin2 = this.handleChangeCoin2.bind(this)
    this.handleChangeFiat1 = this.handleChangeFiat1.bind(this)
    this.handleChangeFiat2 = this.handleChangeFiat2.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleClickMinimum = this.handleClickMinimum.bind(this)
    this.handleClickMaximum = this.handleClickMaximum.bind(this)
  }

  componentWillMount () {
    if (isEmpty(this.props.btcEth)) { this.props.dataActions.getBtcEth() }
    if (isEmpty(this.props.ethBtc)) { this.props.dataActions.getEthBtc() }
  }

  handleChangeCoin1 (e) {
    e.preventDefault()
    const { sourceCoin, targetCoin } = this.props
    const value = e.target.value
    const coin2 = this.convertCoinToCoin(value, sourceCoin, targetCoin, true).value
    const fiat1 = this.convertCoinToFiat(value, sourceCoin).value
    const fiat2 = this.convertCoinToFiat(coin2, targetCoin).value
    this.setState({ coin1: value, coin2, fiat1, fiat2 })
    this.props.input.onChange(value)
  }

  handleChangeCoin2 (e) {
    e.preventDefault()
    const { sourceCoin, targetCoin } = this.props
    const value = e.target.value
    const coin1 = this.convertCoinToCoin(value, targetCoin, sourceCoin, false).value
    const fiat1 = this.convertCoinToFiat(coin1, sourceCoin).value
    const fiat2 = this.convertCoinToFiat(value, targetCoin).value
    this.setState({ coin1, coin2: value, fiat1, fiat2 })
    this.props.input.onChange(coin1)
  }

  handleChangeFiat1 (e) {
    e.preventDefault()
    const { sourceCoin, targetCoin } = this.props
    const value = e.target.value
    const coin1 = this.convertFiatToCoin(value, sourceCoin).value
    const coin2 = this.convertCoinToCoin(coin1, sourceCoin, targetCoin, true).value
    const fiat2 = this.convertCoinToFiat(coin2, targetCoin).value
    this.setState({ coin1, coin2, fiat1: value, fiat2 })
    this.props.input.onChange(coin1)
  }

  handleChangeFiat2 (e) {
    e.preventDefault()
    const { sourceCoin, targetCoin } = this.props
    const value = e.target.value
    const coin2 = this.convertFiatToCoin(value, targetCoin).value
    const coin1 = this.convertCoinToCoin(coin2, targetCoin, sourceCoin, false).value
    const fiat1 = this.convertCoinToFiat(coin1, sourceCoin).value
    this.setState({ coin1, coin2, fiat1, fiat2: value })
    this.props.input.onChange(coin1)
  }

  convertCoinToCoin (value, fromCoin, toCoin, isFrom) {
    const { sourceCoin, targetCoin, btcUnit, ethUnit, btcEth, ethBtc } = this.props
    const rate = sourceCoin === 'BTC' && targetCoin === 'ETH' ? btcEth.rate : ethBtc.rate

    switch (fromCoin) {
      case 'BTC': return Exchange.convertBitcoinToEther({ value: value, fromUnit: btcUnit, toUnit: ethUnit, rate: rate, reverse: !isFrom })
      case 'ETH': return Exchange.convertEtherToBitcoin({ value: value, fromUnit: ethUnit, toUnit: btcUnit, rate: rate, reverse: !isFrom })
      default: return '0'
    }
  }

  convertCoinToFiat (value, fromCoin) {
    const { currency, btcUnit, ethUnit, bitcoinRates, ethereumRates } = this.props
    switch (fromCoin) {
      case 'BTC': return Exchange.convertBitcoinToFiat({ value: value, fromUnit: btcUnit, toCurrency: currency, rates: bitcoinRates })
      case 'ETH': return Exchange.convertEtherToFiat({ value: value, fromUnit: ethUnit, toCurrency: currency, rates: ethereumRates })
      default: return '0'
    }
  }

  convertFiatToCoin (value, toCoin) {
    const { currency, btcUnit, ethUnit, bitcoinRates, ethereumRates } = this.props
    switch (toCoin) {
      case 'BTC': return Exchange.convertFiatToBitcoin({ value: value, fromCurrency: currency, toUnit: btcUnit, rates: bitcoinRates })
      case 'ETH': return Exchange.convertFiatToEther({ value: value, fromCurrency: currency, toUnit: ethUnit, rates: ethereumRates })
      default: return '0'
    }
  }

  handleBlur () {
    if (this.props.input.onBlur) { this.props.input.onBlur(this.state.value) }
  }

  handleFocus () {
    if (this.props.input.onFocus) { this.props.input.onFocus(this.state.value) }
  }

  handleClickMinimum () {
    // switch(this.props.fromCoin) {
    //   case 'ETH':
    //     this.convertCoin(this.props.ethBtc.minimum, true)
    //     break
    //   case 'BTC':
    //     this.convertCoin(this.props.btcEth.minimum, true)
    //     break
    //   default: break
    // }
  }

  handleClickMaximum () {

  }

  render () {
    const { sourceCoin, targetCoin, btcUnit, ethUnit } = this.props
    const { coin1, coin2, fiat1, fiat2 } = this.state
    const coin1Unit = sourceCoin === 'BTC' ? btcUnit : ethUnit
    const coin2Unit = targetCoin === 'BTC' ? btcUnit : ethUnit

    return <CoinConvertor
      coin1={coin1}
      coin2={coin2}
      fiat1={fiat1}
      fiat2={fiat2}
      coin1Unit={coin1Unit}
      coin2Unit={coin2Unit}
      handleChangeCoin1={this.handleChangeCoin1}
      handleChangeCoin2={this.handleChangeCoin2}
      handleChangeFiat1={this.handleChangeFiat1}
      handleChangeFiat2={this.handleChangeFiat2}
      handleBlur={this.handleBlur}
      handleFocus={this.handleFocus}
      handleClickMinimum={this.handleClickMinimum}
      handleClickMaximum={this.handleClickMaximum}
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
  sourceCoin: PropTypes.oneOf(['BTC', 'ETH']).isRequired,
  targetCoin: PropTypes.oneOf(['BTC', 'ETH']).isRequired
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
