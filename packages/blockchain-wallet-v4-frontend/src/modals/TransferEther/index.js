import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { head } from 'ramda'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import TransferEther from './template.js'
import { transactions } from 'blockchain-wallet-v4/src'

class TransferEtherContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit () {

  }

  render () {
    const { legacyAccount, accounts, feeRegular, gasLimit, balance, ...rest } = this.props
    const fee = feeRegular && gasLimit ? transactions.ethereum.calculateFee(feeRegular, gasLimit) : 0

    return (
      <TransferEther
        handleSubmit={this.handleSubmit}
        legacyAccountAddress={legacyAccount.addr}
        defaultAccountAddress={head(accounts).addr}
        amount={balance}
        fee={fee}
        {...rest}
      />
    )
  }
}

const mapStateToProps = state => ({
  legacyAccount: selectors.core.kvStore.ethereum.getLegacyAccount(state),
  accounts: selectors.core.kvStore.ethereum.getAccounts(state),
  feeRegular: selectors.core.data.ethereum.getFeeRegular(state),
  gasLimit: selectors.core.data.ethereum.getGasLimit(state)
})

const mapDispatchToProps = (dispatch) => ({
  paymentActions: bindActionCreators(actions.payment, dispatch)
})

const enhance = compose(
  modalEnhancer('TransferEther'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(TransferEtherContainer)
