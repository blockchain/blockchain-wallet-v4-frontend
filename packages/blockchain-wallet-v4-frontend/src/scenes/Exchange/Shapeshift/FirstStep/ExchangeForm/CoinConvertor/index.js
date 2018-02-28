import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import { getPairFromCoin } from './services'
import Success from './template.success'
import { equals, isNil } from 'ramda'

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
    const { source, target } = nextProps.data.getOrElse({ success: { depositAmount: 0, withdrawalAmount: 0 } })
    // console.log('componentWillReceiveProps', source, target)
    if (!equals(this.state.source, source) || !equals(this.state.target, target)) {
      this.update({ source, target })
    }
  }

  update (data) {
    this.setState(data)
    this.props.input.onChange(data)
  }

  handleChangeSource (value) {
    if (!isNil(value)) {
      if (this.timeout) clearTimeout(this.timeout)
      this.timeout = setTimeout(() => this.props.dataShapeshiftActions.fetchShapeshiftQuotation(value, this.props.pair, true), 1000)
    }
  }

  handleChangeTarget (value) {
    if (!isNil(value)) {
      if (this.timeout) clearTimeout(this.timeout)
      this.timeout = setTimeout(() => this.props.dataShapeshiftActions.fetchShapeshiftQuotation(value, this.props.pair, false), 1000)
    }
  }

  render () {
    // console.log('CoinConvertor Container', this.props)
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
