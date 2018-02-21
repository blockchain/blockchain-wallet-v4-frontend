import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class ComponentContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { coinSourceValue: '', coinTargetValue: '' }
    this.handleChangeCoinSource = this.handleChangeCoinSource.bind(this)
    this.handleChangeCoinTarget = this.handleChangeCoinTarget.bind(this)
  }

  componentWillMount () {
    console.log('componentWillMount', this.props)
    // this.props.shapeshiftDataActions.fetchShapeshiftQuotation(this.props.coinSourceValue, this.props.pair)
  }

  // componentWillReceiveProps (nextProps) {
  //   // Reset coin values when source coin has changed
  //   // if (!equals(this.props.sourceCoin, nextProps.sourceCoin)) {
  //   //   this.setState({ coin1Value: '', coin2Value: '' })
  //   // }
  // }

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
      Success: (value) => this.renderComponent(value),
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }

  renderComponent (value) {
    const { coinSourceValue, coinTargetValue } = this.state
    console.log('ComponentContainer', this.props)

    return <Success
      coinSourceValue={coinSourceValue}
      coinTargetValue={coinTargetValue}
      handleChangeCoinSource={this.handleChangeCoinSource}
      handleChangeCoinTarget={this.handleChangeCoinTarget}
      {...value}
      {...this.props}
    />
  }
}

ComponentContainer.propTypes = {
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired])
  }).isRequired,
  coinSource: PropTypes.oneOf(['BTC', 'ETH', 'BCH']).isRequired,
  coinTarget: PropTypes.oneOf(['BTC', 'ETH', 'BCH']).isRequired
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  dataBitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  dataEthereumActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  shapeshiftDataActions: bindActionCreators(actions.core.data.shapeShift, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ComponentContainer)
