import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import { getPairFromCoin } from './services'
import Success from './template.success'
import { Remote } from 'blockchain-wallet-v4/src'
import { equals, isNil, path } from 'ramda'

class CoinConvertorContainer extends React.Component {
  constructor (props) {
    super(props)
    this.timeout = undefined
    this.state = this.props.input.value
    this.handleChangeSource = this.handleChangeSource.bind(this)
    this.handleChangeTarget = this.handleChangeTarget.bind(this)
    this.handleClickMinimum = this.handleClickMinimum.bind(this)
    this.handleClickMaximum = this.handleClickMaximum.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    // Props have been updated
    if (!equals(this.props.input.value, nextProps.input.value)) {
      console.log('input.value has changed: ', nextProps.input.value)
      this.setState(nextProps.input.value)
    }

     // Reset coin values when source coin has changed
    if (Remote.Success.is(nextProps.data)) {
      const depositAmount = nextProps.data.map(x => path(['success', 'depositAmount'], x)).getOrElse(this.state.source)
      const withdrawalAmount = nextProps.data.map(x => path(['success', 'withdrawalAmount'], x)).getOrElse(this.state.target)
      console.log('remote success', depositAmount, withdrawalAmount)
      // if (!isNil(depositAmount) && !isNil(withdrawalAmount)) {
      nextProps.formActions.change('exchange', 'amount', { source: depositAmount || 0, target: withdrawalAmount || 0 })
      // }
    }
  }

  update (data) {
    this.setState(data)
    this.props.input.onChange(data.coinSourceValue)
  }

  handleChangeSource (value) {
    if (!isNil(value)) {
      if (this.timeout) clearTimeout(this.timeout)
      this.timeout = setTimeout(() => this.props.shapeshiftDataActions.fetchShapeshiftQuotation(value, this.props.pair, true), 1000)
    }
  }

  handleChangeTarget (value) {
    if (!isNil(value)) {
      if (this.timeout) clearTimeout(this.timeout)
      this.timeout = setTimeout(() => this.props.shapeshiftDataActions.fetchShapeshiftQuotation(value, this.props.pair, false), 1000)
    }
  }

  handleClickMinimum () {
    console.log('handleClickMinium')
  }

  handleClickMaximum () {
    console.log('handleClickMaximum')
  }

  render () {
    const { source, target } = this.state

    return this.props.data.cata({
      Success: (value) => <Success {...value} {...this.props} source={source} target={target} handleChangeSource={this.handleChangeSource}
        handleChangeTarget={this.handleChangeTarget} handleClickMinimum={this.handleClickMinimum} handleClickMaximum={this.handleClickMaximum} loading={false} />,
      Failure: (message) => <Success {...this.props} source={source} target={target} loading={false} />,
      Loading: () => <Success {...this.props} source={source} target={target} loading />,
      NotAsked: () => <Success {...this.props} source={source} target={target} loading={false} />
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
  sourceCoin: PropTypes.oneOf(['BTC', 'ETH', 'BCH']).isRequired,
  targetCoin: PropTypes.oneOf(['BTC', 'ETH', 'BCH']).isRequired
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.input.value),
  pair: getPairFromCoin(ownProps.sourceCoin, ownProps.targetCoin)
})

const mapDispatchToProps = (dispatch) => ({
  dataBitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  dataEthereumActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  shapeshiftDataActions: bindActionCreators(actions.core.data.shapeShift, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CoinConvertorContainer)
