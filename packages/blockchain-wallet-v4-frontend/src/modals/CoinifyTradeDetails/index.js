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

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 20px;
`

const renderDetailsRow = (id, message, value, color) => (
  <OrderDetailsRow>
    <Text size='13px' weight={300}><FormattedMessage id={id} defaultMessage={message} /></Text>
    <Text size='13px' weight={300} color={color}>{value}</Text>
  </OrderDetailsRow>
)

class CoinifyTradeDetails extends React.PureComponent {
  render () {
    console.log('CoinifyTradeDetails', this.props)
    const headerStatus = statusHelper(this.props.trade.state)
    const bodyStatus = bodyStatusHelper(this.props.trade.state, this.props.trade.isBuy)
    const { trade, status } = this.props
    const details = tradeDetails.renderDetails(trade)

    return (
      <Modal size='large' position={this.props.position} total={this.props.total}>
        <ModalHeader onClose={this.props.close}>
          <Text color={headerStatus.color}>
            { trade.isBuy ? `Buy Order` : 'Sell Order' } {headerStatus.text}
          </Text>
        </ModalHeader>
        <ModalBody>
          <Text size='13px' weight={300}>
            { bodyStatus.text }
          </Text>
          <Text style={spacing('pt-5')} size='13px' weight={300}>
            <FormattedMessage id='order_details.trade_id' defaultMessage={`Your order ID is: CNY-{id}`} values={{ id: trade.id }} />
          </Text>
          <OrderDetailsTable style={spacing('mt-10')}>
            {renderDetailsRow(
              'order_details.amount_to_purchase',
              trade.isBuy ? 'BTC Purchased' : 'BTC Sold',
              details.firstRow
            )}
            {renderDetailsRow(
              'order_details.trading_fee',
              'Trading Fee',
              details.fee
            )}
            {renderDetailsRow(
              'order_details.total_cost',
              trade.isBuy ? 'Total Cost' : 'Total To Be Received',
              details.total,
              'success'
            )}
          </OrderDetailsTable>
          <ButtonRow>
            <Button width='100px' onClick={this.props.close} nature='primary'>
              <FormattedMessage id='close' defaultMessage='Close' />
            </Button>
          </ButtonRow>
        </ModalBody>
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
