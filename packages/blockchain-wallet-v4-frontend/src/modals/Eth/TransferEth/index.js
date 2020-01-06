import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { actions } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'
import modalEnhancer from 'providers/ModalEnhancer'

import { getData } from './selectors'
import TransferEth from './template'

class TransferEthContainer extends React.PureComponent {
  componentDidMount () {
    this.props.sendEthActions.initialized({
      from: this.props.legacyEthAddr,
      type: 'LEGACY'
    })
  }

  componentDidUpdate (prevProps) {
    if (Remote.Success.is(this.props.data)) {
      const { txFee, ethBalance } = this.props.data.getOrElse({})
      if (parseFloat(txFee) > parseFloat(ethBalance)) {
        this.props.modalActions.closeAllModals()
      }
    }
  }

  handleSubmit = () => {
    const { ethAddr, ethBalance } = this.props.data.getOrElse({})
    this.props.transferEthActions.confirmTransferEth({
      to: ethAddr,
      effectiveBalance: ethBalance
    })
  }

  render () {
    const { data, legacyEthAddr } = this.props
    return data.cata({
      Success: val => (
        <TransferEth
          ethAddr={val.ethAddr}
          ethBalance={val.ethBalance}
          handleSubmit={this.handleSubmit}
          legacyEthAddr={legacyEthAddr}
          txFee={val.txFee}
          {...this.props}
        />
      ),
      Loading: () => null,
      NotAsked: () => null,
      Failure: () => null
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  sendEthActions: bindActionCreators(actions.components.sendEth, dispatch),
  transferEthActions: bindActionCreators(actions.modules.transferEth, dispatch)
})

const enhance = compose(
  modalEnhancer('TransferEth'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(TransferEthContainer)
