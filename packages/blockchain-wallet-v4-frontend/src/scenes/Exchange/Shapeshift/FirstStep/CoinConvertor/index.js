import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Remote } from 'blockchain-wallet-v4/src'
import { equals, isNil, path } from 'ramda'

import { actions, selectors } from 'data'
import { getData } from './selectors'
import { getPairFromCoin } from 'services/ShapeshiftService'
import Success from './template.success'

class CoinConvertorContainer extends React.Component {
  constructor (props) {
    super(props)
    this.timeout = undefined
    const { source, target } = this.props.input.value
    this.state = { source, target }
    this.handleChangeSource = this.handleChangeSource.bind(this)
    this.handleChangeTarget = this.handleChangeTarget.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    // Update value if quotation is successful
    if (Remote.Success.is(nextProps.data) && !equals(this.props.data, nextProps.data)) {
      const data = nextProps.data.getOrElse({ source: undefined, target: undefined })
      this.setState(data)
      this.props.input.onChange(data)
      return
    }
    // Update state if source has changed
    const prevSource = path(['input', 'value', 'source'], this.props)
    const nextSource = path(['input', 'value', 'source'], nextProps)
    if (!isNil(nextSource) && !equals(prevSource, nextSource) && !equals(nextSource, this.state.source)) {
      this.fetchQuotation(nextSource, true)
    }
    // Update state if target has changed
    const prevTarget = path(['input', 'value', 'target'], this.props)
    const nextTarget = path(['input', 'value', 'target'], nextProps)
    if (!isNil(nextTarget) && !equals(prevTarget, nextTarget) && !equals(nextTarget, this.state.target)) {
      this.fetchQuotation(nextTarget, false)
    }
  }

  handleChangeSource (value) {
    const data = { source: value, target: this.state.target }
    this.props.input.onChange(data)
  }

  handleChangeTarget (value) {
    const data = { source: this.state.source, target: value }
    this.props.input.onChange(data)
  }

  fetchQuotation (value, isDeposit) {
    if (!isNil(value)) {
      if (this.timeout) clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.props.dataShapeshiftActions.fetchQuotation(value, this.props.pair, isDeposit)
      }, 1000)
    }
  }

  render () {
    const { source, target } = this.state

    return this.props.data.cata({
      Success: (value) => <Success {...value} {...this.props} source={source} target={target} handleChangeSource={this.handleChangeSource} handleChangeTarget={this.handleChangeTarget} loading={false} />,
      Failure: (message) => <Success {...this.props} source={source} target={target} handleChangeSource={this.handleChangeSource} handleChangeTarget={this.handleChangeTarget} loading={false} />,
      Loading: () => <Success {...this.props} source={source} target={target} loading />,
      NotAsked: () => <Success {...this.props} source={source} target={target} handleChangeSource={this.handleChangeSource} handleChangeTarget={this.handleChangeTarget} loading={false} />
    })
  }
}

CoinConvertorContainer.propTypes = {
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.shape({
      source: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      target: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  }).isRequired,
  sourceCoin: PropTypes.oneOf(['BTC', 'ETH', 'BCH']).isRequired,
  targetCoin: PropTypes.oneOf(['BTC', 'ETH', 'BCH']).isRequired
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state),
  coins: selectors.core.data.bitcoin.getCoins(state).getOrElse([]),
  pair: getPairFromCoin(ownProps.sourceCoin, ownProps.targetCoin)
})

const mapDispatchToProps = (dispatch) => ({
  dataBitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  dataEthereumActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  dataShapeshiftActions: bindActionCreators(actions.core.data.shapeShift, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CoinConvertorContainer)
