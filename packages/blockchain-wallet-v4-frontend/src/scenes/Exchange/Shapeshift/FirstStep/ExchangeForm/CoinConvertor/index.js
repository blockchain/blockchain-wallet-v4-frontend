import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Remote } from 'blockchain-wallet-v4/src'
import { equals, isNil, path, prop } from 'ramda'

import { actions } from 'data'
import { getData } from './selectors'
import { getPairFromCoin } from './services'
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
    // console.log('CoinConvertorContainer componentWillReceiveProps', nextProps)

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
    if (!isNil(nextSource) && !equals(prevSource, nextSource) && !equals(this.state.source, nextSource)) {
      // console.log('fetchQuotation from componentWillReceiveProps SOURCE', this.state.source, nextSource)
      this.fetchQuotation(nextSource, true)
    }

    // Update state if target has changed
    const prevTarget = path(['input', 'value', 'target'], this.props)
    const nextTarget = path(['input', 'value', 'target'], nextProps)
    if (!isNil(nextTarget) && !equals(prevTarget, nextTarget) && !equals(this.state.target, nextTarget)) {
      // console.log('fetchQuotation from componentWillReceiveProps TARGET', this.state.target, nextTarget)
      this.fetchQuotation(nextTarget, false)
    }
  }

  handleChangeSource (value) {
    console.log('handleChangeSource fetchQuotation')
    this.fetchQuotation(value, true)
    // this.props.input.onChange({ source: value, target: this.state.target })
    // this.setState({ source: value, target: this.state.target })
  }

  handleChangeTarget (value) {
    console.log('handleChangeTarget fetchQuotation')
    this.fetchQuotation(value, false)
    // this.props.input.onChange({ source: this.state.source, target: value })
    // this.setState({ source: this.state.source, target: value })
  }

  fetchQuotation (value, isDeposit) {
    console.log('FETCH QUOTATION =======================')
    if (!isNil(value)) {
      if (this.timeout) clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        // const data = isDeposit
        //   ? { source: value, target: this.state.target }
        //   : { source: this.state.source, target: value }
        // this.setState(data)
        // this.props.input.onChange(data)
        this.props.dataShapeshiftActions.fetchShapeshiftQuotation(value, this.props.pair, isDeposit)
      }, 1000)
    }
  }

  render () {
    // console.log('CoinConvertorContainer render', this.props)
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
  pair: getPairFromCoin(ownProps.sourceCoin, ownProps.targetCoin)
})

const mapDispatchToProps = (dispatch) => ({
  dataBitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  dataEthereumActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  dataShapeshiftActions: bindActionCreators(actions.core.data.shapeShift, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CoinConvertorContainer)
