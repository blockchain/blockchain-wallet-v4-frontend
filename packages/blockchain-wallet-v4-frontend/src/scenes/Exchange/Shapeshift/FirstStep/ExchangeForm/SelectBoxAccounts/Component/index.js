import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import { changeSource, changeTarget, initUnspent, updateUnspent } from './services'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class ComponentContainer extends React.Component {
  constructor (props) {
    super(props)
    const { source, target } = this.props.value
    this.state = { source, target }
    this.handleSwap = this.handleSwap.bind(this)
    this.handleChangeSource = this.handleChangeSource.bind(this)
    this.handleChangeTarget = this.handleChangeTarget.bind(this)
  }

  componentWillMount () {
    // Init unspent
    initUnspent(this.props)
  }

  componentWillReceiveProps (nextProps) {
    // Update unspent if new source is BTC
    updateUnspent(this.props, nextProps)
    // Update effectiveBalance if coins have changed
    // updateEffectiveBalance(this.props, nextProps)
  }

  handleSwap () {
    const newState = { source: this.state.target, target: this.state.source }
    this.setState(newState)
    this.props.onChange(newState)
  }

  handleChangeSource (value) {
    const { btcBalances, ethBalances } = this.props
    const { source, target } = this.state
    const newState = changeSource(source, value, target, btcBalances, ethBalances)
    this.setState(newState)
    this.props.onChange(newState)
  }

  handleChangeTarget (value) {
    const { btcBalances, ethBalances } = this.props
    const { source, target } = this.state
    const newState = changeTarget(target, value, source, btcBalances, ethBalances)
    this.setState(newState)
    this.props.onChange(newState)
  }

  render () {
    const { data, ...rest } = this.props
    console.log('rest', ...rest)
    const { source, target } = this.state

    return data.cata({
      Success: (value) => <Success
        {...rest}
        source={source}
        target={target}
        handleSwap={this.handleSwap}
        handleChangeSource={this.handleChangeSource}
        handleChangeTarget={this.handleChangeTarget}
      />,
      Failure: (message) => <Error />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

ComponentContainer.defaultProps = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.shape({
    source: PropTypes.object.isRequired,
    target: PropTypes.object.isRequired
  }),
  elements: PropTypes.array.isRequired,
  defaultSourceCoin: PropTypes.string.isRequired,
  defaultTargetCoin: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  dataBitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ComponentContainer)
