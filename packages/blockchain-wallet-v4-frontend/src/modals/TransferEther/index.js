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
    const { legacyAccountAddress, defaultAccountAddress, balance } = this.props
    this.props.paymentEthereumActions.transferEther(legacyAccountAddress, defaultAccountAddress, balance)
  }

  render () {
    return <TransferEther handleSubmit={this.handleSubmit} {...this.props} />
  }
}

const mapStateToProps = state => {
  const legacyAccount = selectors.core.kvStore.ethereum.getLegacyAccount(state)
  const accounts = selectors.core.kvStore.ethereum.getAccounts(state)
  const feeRegular = selectors.core.data.ethereum.getFeeRegular(state)
  const gasLimit = selectors.core.data.ethereum.getGasLimit(state)
  const fee = (feeRegular && gasLimit) ? transactions.ethereum.calculateFee(feeRegular, gasLimit) : 0

  return {
    legacyAccountAddress: legacyAccount.addr,
    defaultAccountAddress: head(accounts).addr,
    fee
  }
}

const mapDispatchToProps = (dispatch) => ({
  paymentEthereumActions: bindActionCreators(actions.payment.ethereum, dispatch)
})

const enhance = compose(
  modalEnhancer('TransferEther'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(TransferEtherContainer)
