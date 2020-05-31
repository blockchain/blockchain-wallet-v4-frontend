import { actions } from 'data'
import { bindActionCreators, compose } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import { Remote } from 'blockchain-wallet-v4/src'
import modalEnhancer from 'providers/ModalEnhancer'
import React from 'react'
import TransferEth from './template'

class TransferEthContainer extends React.PureComponent<Props> {
  componentDidMount () {
    this.props.transferEthActions.initialized({
      from: this.props.legacyEthAddr,
      type: 'LEGACY'
    })
  }

  componentDidUpdate () {
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
          onSubmit={this.handleSubmit}
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
  transferEthActions: bindActionCreators(actions.modules.transferEth, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(modalEnhancer('TransferEth'), connector)

type OwnProps = {
  legacyEthAddr: string
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(TransferEthContainer)
