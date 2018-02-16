import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals } from 'ramda'

import { convertCoin1, convertCoin2, convertFiat1, convertFiat2 } from './conversion'
import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class CoinConvertorContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = { coin1: this.props.input.value || '', coin2: '', fiat1: '', fiat2: '' }
    this.handleChangeCoin1 = this.handleChangeCoin1.bind(this)
    this.handleChangeCoin2 = this.handleChangeCoin2.bind(this)
    this.handleChangeFiat1 = this.handleChangeFiat1.bind(this)
    this.handleChangeFiat2 = this.handleChangeFiat2.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleClickMinimum = this.handleClickMinimum.bind(this)
    this.handleClickMaximum = this.handleClickMaximum.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(this.props.sourceCoin, nextProps.sourceCoin)) {
      this.setState({ coin1: '', coin2: '', fiat1: '', fiat2: '' })
    }
  }

  update (data) {
    this.setState(data)
    this.props.input.onChange(data.coin1)
  }

  handleChangeCoin1 (e) {
    e.preventDefault()
    const value = e.target.value
    const { sourceCoin, targetCoin, data } = this.props
    convertCoin1(value, sourceCoin, targetCoin, data).map(x => this.update(x))
  }

  handleChangeCoin2 (e) {
    e.preventDefault()
    const value = e.target.value
    const { sourceCoin, targetCoin, data } = this.props
    convertCoin2(value, sourceCoin, targetCoin, data).map(x => this.update(x))
  }

  handleChangeFiat1 (e) {
    e.preventDefault()
    const value = e.target.value
    const { sourceCoin, targetCoin, data } = this.props
    convertFiat1(value, sourceCoin, targetCoin, data).map(x => this.update(x))
  }

  handleChangeFiat2 (e) {
    e.preventDefault()
    const value = e.target.value
    const { sourceCoin, targetCoin, data } = this.props
    convertFiat2(value, sourceCoin, targetCoin, data).map(x => this.update(x))
  }

  handleBlur () {
    if (this.props.input.onBlur) { this.props.input.onBlur(this.state.value) }
  }

  handleFocus () {
    if (this.props.input.onFocus) { this.props.input.onFocus(this.state.value) }
  }

  handleClickMinimum () { }

  handleClickMaximum () { }

  renderComponent (value) {
    const { sourceCoin, targetCoin } = this.props
    const { coin1, coin2, fiat1, fiat2 } = this.state
    const coin1Unit = sourceCoin === 'BTC' ? value.btcUnit : value.ethUnit
    const coin2Unit = targetCoin === 'BTC' ? value.btcUnit : value.ethUnit

    return <Success
      coin1={coin1}
      coin2={coin2}
      fiat1={fiat1}
      fiat2={fiat2}
      coin1Unit={coin1Unit}
      coin2Unit={coin2Unit}
      currency={value.currency}
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

  render () {
    const { data } = this.props

    return data.cata({
      Success: (value) => this.renderComponent(value),
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
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

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.sourceCoin, ownProps.targetCoin)
})

const mapDispatchToProps = (dispatch) => ({
  bitcoinDataActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  ethereumDataActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  shapeshiftDataActions: bindActionCreators(actions.core.data.shapeShift, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CoinConvertorContainer)
