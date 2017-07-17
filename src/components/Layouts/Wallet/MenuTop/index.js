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
    this.props.modalActions.showModalSendBitcoin()
  }

  openRequestBitcoin () {
    this.props.modalActions.showModalRequestBitcoin()
  }

  render () {
    return <MenuTop
      {...this.props}
      toggleCurrencyDisplay={this.toggleCurrencyDisplay}
      openSendBitcoin={this.openSendBitcoin}
      openRequestBitcoin={this.openRequestBitcoin} />
  }
}

MenuTopContainer.defaultProps = {
  balance: 0
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
