import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals, prop } from 'ramda'

import { actions } from 'data'
import MinimumMaximum from './template'

class MinimumMaximumContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClickMinimum = this.handleClickMinimum.bind(this)
    this.handleClickMaximum = this.handleClickMaximum.bind(this)
  }

  handleClickMinimum () {
    console.log('handleClickMinimum')
    const { sourceCoin, targetCoin } = this.props
    const btcEthMinimum = prop('minimum', this.props.btcEth)
    const ethBtcMinimum = prop('minimum', this.props.ethBtc)
    console.log(sourceCoin, targetCoin)
    if (equals('BTC', sourceCoin) && equals('ETH', targetCoin)) {
      this.props.formActions.change('exchange', 'amount', { source: `${btcEthMinimum}`, target: undefined })
    }
    if (equals('ETH', sourceCoin) && equals('BTC', targetCoin)) {
      this.props.formActions.change('exchange', 'amount', { source: `${ethBtcMinimum}`, target: undefined })
    }
  }

  handleClickMaximum () {
    console.log('handleClickMaximum')
  }

  render () {
    // console.log('MinimumMaximum render', this.props)
    return <MinimumMaximum handleClickMinimum={this.handleClickMinimum} handleClickMaximum={this.handleClickMaximum} />
  }
}

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(undefined, mapDispatchToProps)(MinimumMaximumContainer)
