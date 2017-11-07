import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import TransferEther from './template.js'

class TransferEtherContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit () {

  }

  render () {
    return (
      <TransferEther
        handleSubmit={this.handleSubmit}
        legacyAccountAddress='legacy address'
        defaultAccountAddress='default address'
        amount={`${500} ETH`}
        fee={`${100} ETH`}
      />
    )
  }
}

const mapStateToProps = state => ({
  legacyAccount: selectors.core.kvStore.ethereum.getLegacyAccount(state),
  accounts: selectors.core.kvStore.ethereum.getAccounts(state)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('TransferEther'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(TransferEtherContainer)
