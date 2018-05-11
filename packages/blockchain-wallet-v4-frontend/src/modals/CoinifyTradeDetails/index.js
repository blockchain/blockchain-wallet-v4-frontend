import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import { Modal } from 'blockchain-info-components'

import Trade from './Trade'
import Kyc from './Kyc'

class CoinifyTradeDetails extends React.PureComponent {
  render () {
    const { trade, status } = this.props

    const renderComponent = (trade) => (
      trade.constructor.name === 'Trade'
        ? <Trade trade={trade} close={this.props.close} />
        : <Kyc status={status} close={this.props.close} />
    )

    return (
      <Modal size='large' position={this.props.position} total={this.props.total}>
        { renderComponent(trade) }
      </Modal>
    )
  }
}

const mapStateToProps = (state) => ({
  account: undefined
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('CoinifyTradeDetails'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(CoinifyTradeDetails)
