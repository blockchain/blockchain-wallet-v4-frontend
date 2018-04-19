import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { FormattedMessage } from 'react-intl'
import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import { Icon, Modal, ModalHeader, ModalBody, Text } from 'blockchain-info-components'
import { OrderDetailsTable, OrderDetailsRow } from 'components/BuySell/OrderDetails'
import { MethodContainer } from 'components/BuySell/styled.js'
import { statusHelper, bodyStatusHelper } from 'services/SfoxService'
import { spacing } from 'services/StyleService'
import FundingSource from 'components/BuySell/FundingSource'

const renderDetailsRow = (id, message, value, color) => (
  <OrderDetailsRow>
    <Text size='13px' weight={300}><FormattedMessage id={id} defaultMessage={message} /></Text>
    <Text size='13px' weight={300} color={color}>{value}</Text>
  </OrderDetailsRow>
)
const renderFirstRow = trade => {
  if (trade.isBuy) {
    if (trade.outCurrency === 'BTC') return `${trade.receiveAmount} BTC ($${((+trade.sendAmount / 1e8) - trade.feeAmount).toFixed(2)})`
    else return `${trade.quoteAmount / 1e8} BTC ($${(+trade.baseAmount - +trade.feeAmount).toFixed(2)})`
  } else {
    if (trade.outCurrency === 'USD') return `${trade.sendAmount / 1e8} BTC ($${(+trade.receiveAmount + +trade.feeAmount).toFixed(2)})`
    else return ``
  }
}
const renderTotal = trade => {
  if (trade.isBuy) return trade.outCurrency === 'BTC' ? `$${(+trade.inAmount / 1e8).toFixed(2)}` : `$${trade.baseAmount}`
  else return `$${trade.receiveAmount.toFixed(2)}`
}

class SfoxTradeDetails extends React.Component {
  render () {
    const headerStatus = statusHelper(this.props.trade.state)
    const bodyStatus = bodyStatusHelper(this.props.trade.state)
    const { account, trade } = this.props
    console.log('trade details render', this.props, this.props.trade.isBuy)
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
            <FormattedMessage id='order_details.trade_id' defaultMessage={`Your order ID is: SFX-{id}`} values={{ id: trade.id }} />
          </Text>
          <Text style={spacing('mt-20')} size='14px' weight={400}>
            { trade.isBuy ? <FormattedMessage id='order_details.method' defaultMessage='Payment Method' /> : <FormattedMessage id='order_details.receiving_funds_into' defaultMessage='Receiving Funds Into' /> }
          </Text>
          <MethodContainer borderDark style={spacing('mt-5')}>
            <Icon name='bank-filled' size='30px' />
            <FundingSource account={account[0]} />
          </MethodContainer>
          <OrderDetailsTable style={spacing('mt-10')}>
            {renderDetailsRow(
              'order_details.amount_to_purchase',
              trade.isBuy ? 'BTC Amount to Purchase' : 'BTC Amount to Sell',
              renderFirstRow(trade))
            }
            {renderDetailsRow(
              'order_details.trading_fee',
              'Trading Fee',
              `$${(+trade.feeAmount).toFixed(2)}`
            )}
            {renderDetailsRow(
              'order_details.total_cost',
              trade.isBuy ? 'Total Cost' : 'Total To Be Received',
              renderTotal(trade),
              'success'
            )}
          </OrderDetailsTable>
        </ModalBody>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => ({
  account: selectors.core.data.sfox.getAccounts(state).data
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('SfoxTradeDetails'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(SfoxTradeDetails)
