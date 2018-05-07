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
    const { showBitcoinCashWelcome } = this.props
    return <BitcoinCashWelcome displayed={showBitcoinCashWelcome} handleClick={this.handleClick} handleRequest={this.handleRequest} />
  }
}

const mapStateToProps = state => ({
  showBitcoinCashWelcome: selectors.preferences.getShowBitcoinCashWelcome(state)
})

const mapDispatchToProps = dispatch => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BitcoinCashWelcomeContainer)
