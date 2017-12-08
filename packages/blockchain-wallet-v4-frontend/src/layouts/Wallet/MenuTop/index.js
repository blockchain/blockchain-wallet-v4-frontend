import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import MenuTop from './template.js'

class MenuTopContainer extends React.Component {
  constructor (props) {
    super(props)
    this.openSend = this.openSend.bind(this)
    this.openRequest = this.openRequest.bind(this)
    this.toggleCoinDisplay = this.toggleCoinDisplay.bind(this)
  }

  toggleCoinDisplay () {
    this.props.preferencesActions.toggleCoinDisplayed()
  }

  openSend () {
    if (this.props.router.location.pathname === '/eth/transactions') {
      this.props.sendEtherActions.initSendEther()
    } else {
      this.props.sendBitcoinActions.initSendBitcoin()
    }
  }

  openRequest () {
    if (this.props.router.location.pathname === '/eth/transactions') {
      this.props.modalActions.showModal('RequestEther')
    } else {
      this.props.modalActions.showModal('RequestBitcoin')
    }
  }

  render () {
    return <MenuTop
      {...this.props}
      toggleCoinDisplay={this.toggleCoinDisplay}
      openSend={this.openSend}
      openRequest={this.openRequest} />
  }
}

const mapStateToProps = (state) => ({
  bitcoinBalance: selectors.core.data.bitcoin.getBalance(state),
  etherBalance: selectors.core.data.ethereum.getBalance(state),
  router: state.router
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  sendBitcoinActions: bindActionCreators(actions.components.sendBitcoin, dispatch),
  sendEtherActions: bindActionCreators(actions.components.sendEther, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MenuTopContainer)
