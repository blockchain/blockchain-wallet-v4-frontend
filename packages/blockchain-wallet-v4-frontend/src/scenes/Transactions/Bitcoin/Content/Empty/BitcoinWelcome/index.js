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
    const { showBitcoinWelcome } = this.props
    return <BitcoinWelcome displayed={showBitcoinWelcome} handleClick={this.handleClick} handleRequest={this.handleRequest} />
  }
}

const mapStateToProps = state => ({
  showBitcoinWelcome: selectors.preferences.getShowBitcoinWelcome(state)
})

const mapDispatchToProps = dispatch => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BitcoinWelcomeContainer)
