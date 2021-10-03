import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions } from 'data'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { getData } from './selectors'
import TransferEth from './template'

const DEFAULTS = {
  ethAddr: '',
  ethBalance: '0',
  txFee: '0'
}

class TransferEthContainer extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.transferEthActions.initialized({
      from: this.props.legacyEthAddr,
      type: 'LEGACY'
    })
  }

  componentDidUpdate() {
    if (Remote.Success.is(this.props.data)) {
      const { ethBalance, txFee } = this.props.data.getOrElse(DEFAULTS)
      if (parseFloat(txFee) > parseFloat(ethBalance)) {
        this.props.modalActions.closeAllModals()
      }
    }
  }

  handleSubmit = () => {
    const { ethAddr, ethBalance } = this.props.data.getOrElse(DEFAULTS)
    this.props.transferEthActions.confirmTransferEth({
      effectiveBalance: ethBalance,
      to: ethAddr
    })
  }

  render() {
    const { data, legacyEthAddr } = this.props
    return data.cata({
      Failure: () => null,
      Loading: () => null,
      NotAsked: () => null,
      Success: (val) => (
        <TransferEth
          ethAddr={val.ethAddr}
          ethBalance={val.ethBalance}
          onSubmit={this.handleSubmit}
          legacyEthAddr={legacyEthAddr}
          txFee={val.txFee}
          {...this.props}
        />
      )
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  transferEthActions: bindActionCreators(actions.modules.transferEth, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(modalEnhancer(ModalName.TRANSFER_ETH_MODAL), connector)

type OwnProps = {
  legacyEthAddr: string
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(TransferEthContainer)
