import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import BitcoinCashWelcome from './template.js'

class BitcoinCashWelcomeContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleRequest = this.handleRequest.bind(this)
  }

  handleClick () {
    this.props.preferencesActions.setBitcoinCashWelcome(false)
  }

  handleRequest () {
    this.props.modalActions.showModal('RequestBch')
  }

  render () {
    const { showBitcoinCashWelcome, ethBalanceR, btcBalanceR } = this.props
    const exchange = ethBalanceR.getOrElse(0) + btcBalanceR.getOrElse(0) > 0
    return <BitcoinCashWelcome displayed={showBitcoinCashWelcome} handleClick={this.handleClick} handleRequest={this.handleRequest} exchange={exchange} />
  }
}

const mapStateToProps = state => ({
  ethBalanceR: selectors.core.data.ether.getBalance(state),
  btcBalanceR: selectors.core.data.bitcoin.getBalance(state),
  showBitcoinCashWelcome: selectors.preferences.getShowBitcoinCashWelcome(state)
})

const mapDispatchToProps = dispatch => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BitcoinCashWelcomeContainer)
