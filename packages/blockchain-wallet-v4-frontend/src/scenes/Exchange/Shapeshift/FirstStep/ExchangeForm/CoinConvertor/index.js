import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals } from 'ramda'

import { actions } from 'data'
import { getData } from './selectors'
import { getPairFromCoin } from './services'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class CoinConvertorContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { coinSourceValue: this.props.input.value || '', coinTargetValue: '' }
    this.handleChangeCoinSource = this.handleChangeCoinSource.bind(this)
    this.handleChangeCoinTarget = this.handleChangeCoinTarget.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    // Reset coin values when source coin has changed
    if (!equals(this.props.sourceCoin, nextProps.sourceCoin)) {
      this.setState({ coinSourceValue: '', coinTargetValue: '' })
    }
  }

  update (data) {
    this.setState(data)
    this.props.input.onChange(data.coin1)
  }

  handleChangeCoinSource (value) {
    this.props.shapeshiftDataActions.fetchShapeshiftQuotation(value, this.props.pair)
  }

  handleChangeCoinTarget (value) {
    this.props.shapeshiftDataActions.fetchShapeshiftQuotation(value, this.props.pair)
  }

  render () {
    return this.props.data.cata({
      Success: (value) => this.renderComponent(false, value),
      Failure: (message) => this.renderComponent(false, undefined, message),
      Loading: () => this.renderComponent(true),
      NotAsked: () => this.renderComponent(false)
    })
  }

  renderComponent (loading, value, message) {
    console.log('renderComponent', loading, value, message)

    return <Success
      coinSourceValue={this.state.coinSourceValue}
      coinTargetValue={this.state.coinTargetValue}
      handleChangeCoinSource={this.handleChangeCoinSource}
      handleChangeCoinTarget={this.handleChangeCoinTarget}
      loading={loading}
      {...value}
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
  coinSource: PropTypes.oneOf(['BTC', 'ETH', 'BCH']).isRequired,
  coinTarget: PropTypes.oneOf(['BTC', 'ETH', 'BCH']).isRequired
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.coinSource, ownProps.coinTarget),
  pair: getPairFromCoin(ownProps.coinSource, ownProps.coinTarget)
})

const mapDispatchToProps = (dispatch) => ({
  dataBitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  dataEthereumActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  shapeshiftDataActions: bindActionCreators(actions.core.data.shapeShift, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CoinConvertorContainer)
