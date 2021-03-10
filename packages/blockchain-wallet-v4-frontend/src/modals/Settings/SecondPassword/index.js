import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { Types } from 'blockchain-wallet-v4/src'
import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import * as C from 'services/alerts'

import SecondPassword from './template.js'

class SecondPasswordContainer extends React.PureComponent {
  state = { secondPassword: '' }

  handleSubmit = e => {
    e.preventDefault()
    if (
      Types.Wallet.isValidSecondPwd(
        this.state.secondPassword,
        this.props.wallet
      )
    ) {
      this.props.walletActions.submitSecondPassword(this.state.secondPassword)
      this.props.modalActions.closeModal()
    } else {
      this.props.alertActions.displayError(C.SECOND_PASSWORD_INVALID_ERROR)
      this.setState({ secondPassword: '' })
    }
  }

  handleChange = event => {
    this.setState({ secondPassword: event.target.value })
  }

  render() {
    return (
      <SecondPassword
        {...this.props}
        handleSubmit={this.handleSubmit}
        handleChange={this.handleChange}
        value={this.state.secondPassword}
      />
    )
  }
}
const mapStateToProps = state => ({
  wallet: selectors.core.wallet.getWallet(state)
})

const mapDispatchToProps = dispatch => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  walletActions: bindActionCreators(actions.wallet, dispatch)
})

const enhance = compose(
  modalEnhancer('SecondPassword'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(SecondPasswordContainer)
