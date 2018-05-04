import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import Success from './template.success.js'
import { getData } from './selectors.js'
import { Remote } from 'blockchain-wallet-v4/src'

class TransferEtherContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidUpdate (prevProps) {
    if (Remote.Success.is(this.props.data)) {
      const { fee, effectiveBalance } = this.props.data.data
      if (parseFloat(fee) > parseFloat(effectiveBalance)) this.props.modalActions.closeAllModals()
    }
  }

  componentDidMount () {
    this.props.sendEthActions.sendEthInitialized({ from: this.props.addr, type: 'LEGACY' })
  }

  handleSubmit () {
    const { to, effectiveBalance } = this.props.data.data
    this.props.transferEtherActions.confirmTransferEth({ to, effectiveBalance })
  }

  render () {
    const { addr, data } = this.props
    return data.cata({
      Success: (val) => <Success handleSubmit={this.handleSubmit} from={addr} val={val} {...this.props} />,
      Loading: () => null,
      NotAsked: () => null,
      Failure: () => null
    })
  }
}

const mapStateToProps = state => {
  return {
    data: getData(state)
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  sendEthActions: bindActionCreators(actions.components.sendEth, dispatch),
  transferEtherActions: bindActionCreators(actions.modules.transferEther, dispatch)
})

const enhance = compose(
  modalEnhancer('TransferEther'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(TransferEtherContainer)
