import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { head } from 'ramda'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import TransferEther from './template.js'
import { transactions } from 'blockchain-wallet-v4/src'

class TransferEtherContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit () {
    this.props.transferEtherActions.transferEther()
  }

  render () {
    return <TransferEther handleSubmit={this.handleSubmit} {...this.props} />
  }
}

const mapStateToProps = state => {
  const legacyAccount = selectors.core.data.ethereum.getLegacyAccount(state)
  const legacyAccountAddress = legacyAccount.account
  const defaultAccountAddress = head(selectors.core.kvStore.ethereum.getAccounts(state)).addr
  const balance = legacyAccount.balance
  const gasPrice = selectors.core.data.ethereum.getFeeRegular(state)
  const gasLimit = selectors.core.data.ethereum.getGasLimit(state)
  const fee = (gasPrice && gasLimit) ? transactions.ethereum.calculateFee(gasPrice, gasLimit) : 0

  return {
    from: legacyAccountAddress,
    to: defaultAccountAddress,
    balance,
    fee
  }
}

const mapDispatchToProps = (dispatch) => ({
  transferEtherActions: bindActionCreators(actions.modules.transferEther, dispatch)
})

const enhance = compose(
  modalEnhancer('TransferEther'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(TransferEtherContainer)
