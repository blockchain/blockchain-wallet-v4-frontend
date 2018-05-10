import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getCanBuy } from './selectors'
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
    const { showBitcoinWelcome, canBuy } = this.props
    const partner = canBuy.cata({ Success: (val) => val, Loading: () => false, Failure: () => false, NotAsked: () => false })
    return <BitcoinWelcome displayed={showBitcoinWelcome} handleClick={this.handleClick} handleRequest={this.handleRequest} partner={partner} />
  }
}

const mapStateToProps = state => ({
  canBuy: getCanBuy(state),
  showBitcoinWelcome: selectors.preferences.getShowBitcoinWelcome(state)
})

const mapDispatchToProps = dispatch => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BitcoinWelcomeContainer)
