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
    this.toggleCoinDisplay = this.toggleCoinDisplay.bind(this)
  }

  toggleCoinDisplay () {
    this.props.preferencesActions.toggleCoinDisplayed()
  }

  openSendBitcoin () {
    this.props.paymentActions.initSendBitcoin()
  }

  openRequestBitcoin () {
    this.props.modalActions.showModal('RequestBitcoin')
  }

  render () {
    return <MenuTop
      {...this.props}
      toggleCoinDisplay={this.toggleCoinDisplay}
      openSendBitcoin={this.openSendBitcoin}
      openRequestBitcoin={this.openRequestBitcoin} />
  }
}

MenuTopContainer.defaultProps = {
  balance: 0
}

const mapStateToProps = (state) => ({
  coinDisplayed: selectors.preferences.getCoinDisplayed(state),
  balance: selectors.core.data.info.getBalance(state)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  paymentActions: bindActionCreators(actions.payment, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MenuTopContainer)
