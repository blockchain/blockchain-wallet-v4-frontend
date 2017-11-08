import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { head } from 'ramda'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import TransferEther from './template.js'

class TransferEtherContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit () {
    // this.props.paymentActions.
  }

  render () {
    const { legacyAccount, accounts, ...rest } = this.props

    return (
      <TransferEther
        handleSubmit={this.handleSubmit}
        legacyAccountAddress={legacyAccount.addr}
        defaultAccountAddress={head(accounts).addr}
        amount={`${500} ETH`}
        fee={`${100} ETH`}
        {...rest}
      />
    )
  }
}

const mapStateToProps = state => ({
  legacyAccount: selectors.core.kvStore.ethereum.getLegacyAccount(state),
  accounts: selectors.core.kvStore.ethereum.getAccounts(state)
})

const mapDispatchToProps = (dispatch) => ({
  paymentActions: bindActionCreators(actions.payment, dispatch)
})

const enhance = compose(
  modalEnhancer('TransferEther'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(TransferEtherContainer)
