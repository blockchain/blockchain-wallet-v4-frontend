import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { actions } from 'data'
import { getData } from './selectors.js'
import { Remote } from 'blockchain-wallet-v4/src'
import modalEnhancer from 'providers/ModalEnhancer'
import Success from './template.success.js'

class TransferEthContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {
    this.props.sendEthActions.initialized({
      from: this.props.addr,
      type: 'LEGACY'
    })
  }

  componentDidUpdate (prevProps) {
    if (Remote.Success.is(this.props.data)) {
      const { fee, effectiveBalance } = this.props.data.getOrElse({})
      if (parseFloat(fee) > parseFloat(effectiveBalance)) {
        this.props.modalActions.closeAllModals()
      }
    }
  }

  handleSubmit () {
    const { to, effectiveBalance } = this.props.data.getOrElse({})
    this.props.transferEthActions.confirmTransferEth({ to, effectiveBalance })
  }

  render () {
    const { addr, data } = this.props
    return data.cata({
      Success: val => (
        <Success
          handleSubmit={this.handleSubmit}
          from={addr}
          val={val}
          {...this.props}
        />
      ),
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
