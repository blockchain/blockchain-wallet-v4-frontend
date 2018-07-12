import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import BitcoinWelcome from './template.js'

class BitcoinWelcomeContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleRequest = this.handleRequest.bind(this)
  }

  handleClick () {
    this.props.preferencesActions.setBitcoinWelcome(false)
  }

  handleRequest () {
    this.props.modalActions.showModal('RequestBitcoin')
  }

  render () {
    const { showBitcoinWelcome, canBuy, bchBalanceR, ethBalanceR } = this.props
    const exchange = ethBalanceR.getOrElse(0) + bchBalanceR.getOrElse(0) > 0
    const partner = canBuy.cata({ Success: (val) => val, Loading: () => false, Failure: () => false, NotAsked: () => false })
    return <BitcoinWelcome displayed={showBitcoinWelcome} handleClick={this.handleClick} handleRequest={this.handleRequest} partner={partner} exchange={exchange} />
  }
}

const mapStateToProps = state => ({
  canBuy: selectors.exchange.getCanTrade(state, 'Buy'),
  bchBalanceR: selectors.core.data.bch.getBalance(state),
  ethBalanceR: selectors.core.data.ethereum.getBalance(state),
  showBitcoinWelcome: selectors.preferences.getShowBitcoinWelcome(state)
})

const mapDispatchToProps = dispatch => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BitcoinWelcomeContainer)
