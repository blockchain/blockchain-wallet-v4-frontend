import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import MenuTop from './template.js'

class MenuTopContainer extends React.Component {
  constructor (props) {
    super(props)
    this.openSendBitcoin = this.openSendBitcoin.bind(this)
    this.openRequestBitcoin = this.openRequestBitcoin.bind(this)
    this.toggleCurrencyDisplay = this.toggleCurrencyDisplay.bind(this)
  }

  toggleCurrencyDisplay () {
    this.props.uiActions.toggleCurrencyDisplay()
  }

  openSendBitcoin () {
    // this.props.actions.showModalSendBitcoinStep1()
  }

  openRequestBitcoin () {
    this.props.modalActions.showModalRequestBitcoinStep1()
  }

  render () {
    return <MenuTop
      bitcoinDisplayed={this.props.bitcoinDisplayed}
      toggleCurrencyDisplay={this.toggleCurrencyDisplay}
      balance={this.props.balance}
      openSendBitcoin={this.openSendBitcoin}
      openRequestBitcoin={this.openRequestBitcoin} />
  }
}

const mapStateToProps = (state) => ({
  bitcoinDisplayed: selectors.ui.getBitcoinDisplayed(state),
  balance: selectors.core.info.getBalance(state)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  uiActions: bindActionCreators(actions.ui, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MenuTopContainer)
