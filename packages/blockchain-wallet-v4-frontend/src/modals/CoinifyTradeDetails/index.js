import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { FormattedMessage } from 'react-intl'
import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import { Modal, ModalHeader, ModalBody, Text, Button } from 'blockchain-info-components'
import { OrderDetailsTable, OrderDetailsRow } from 'components/BuySell/OrderDetails'
import { tradeDetails, statusHelper, bodyStatusHelper } from 'services/CoinifyService'
import { spacing } from 'services/StyleService'

import Trade from './Trade'
import Kyc from './KYC'

class CoinifyTradeDetails extends React.PureComponent {
  render () {
    console.log('CoinifyTradeDetails', this.props)

    const { trade, status } = this.props

    const renderComponent = (trade) => (
      trade.constructor.name === 'Trade'
        ? <Trade trade={trade} close={this.props.close} />
        : <Kyc status={status} />
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
