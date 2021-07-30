import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import AddBtcWallet from './template.js'

class AddBtcWalletContainer extends React.PureComponent {
  onSubmit = () => {
    this.props.actions.newHDAccount(this.props.wallet)
  }

  render() {
    return <AddBtcWallet {...this.props} onSubmit={this.onSubmit} />
  }
}

const mapStateToProps = (state) => ({
  wallet: formValueSelector('addBtcWallet')(state, 'wallet')
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  modalEnhancer('ADD_BTC_WALLET_MODAL'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(AddBtcWalletContainer)
