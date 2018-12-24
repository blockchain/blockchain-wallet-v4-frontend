import React from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { FormattedMessage } from 'react-intl'
import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import {
  Icon,
  Modal,
  ModalHeader,
  ModalBody,
  Text,
  Button,
  TooltipIcon,
  TooltipHost
} from 'blockchain-info-components'
import {
  OrderDetailsTable,
  OrderDetailsRow
} from 'components/BuySell/OrderDetails'
import { MethodContainer } from 'components/BuySell/styled.js'
import { statusHelper, bodyStatusHelper } from 'services/SfoxService'
import { spacing } from 'services/StyleService'
import FundingSource from 'components/BuySell/FundingSource'

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 20px;
`
const ToolTipWrapper = styled.div`
  display: flex;
  flex-direction: row;
  div:first-of-type {
    margin-right: 5px;
  }
`

const renderFirstRow = trade => {
  if (trade.isBuy) {
    if (trade.outCurrency === 'BTC') {
      return `${trade.receiveAmount} BTC ($${(
        +trade.sendAmount / 1e8 -
        trade.feeAmount
      ).toFixed(2)})`
    } else {
      return `${trade.quoteAmount / 1e8} BTC ($${(
        +trade.baseAmount - +trade.feeAmount
      ).toFixed(2)})`
    }
  } else {
    if (trade.outCurrency === 'USD') {
      return `${trade.sendAmount / 1e8} BTC ($${trade.receiveAmount.toFixed(
        2
      )})`
    } else return ``
  }
}
const renderTotal = trade => {
  if (trade.isBuy) {
    return trade.outCurrency === 'BTC'
      ? `$${(+trade.inAmount / 1e8).toFixed(2)}`
      : `$${trade.baseAmount}`
  } else return `$${(trade.receiveAmount - trade.feeAmount).toFixed(2)}`
}

class SfoxTradeDetails extends React.PureComponent {
  render () {
    const { account, trade } = this.props
    const { expectedDelivery, feeAmount, id, isBuy, state } = trade
    const headerStatus = statusHelper(state)
    const bodyStatus = bodyStatusHelper(state, isBuy, expectedDelivery)

    return (
      <Modal
        size='large'
        position={this.props.position}
        total={this.props.total}
      >
        <ModalHeader onClose={this.props.close}>
          <Text color={headerStatus.color}>
            {isBuy ? `Buy Order` : 'Sell Order'} {headerStatus.text}
          </Text>
        </ModalHeader>
        <ModalBody>
          <Text size='13px' weight={300}>
            {bodyStatus.text}
          </Text>
          <Text style={spacing('pt-5')} size='13px' weight={300}>
            <FormattedMessage
              id='sfoxtradedetails.orderdetails.tradeid'
              defaultMessage='Your order ID is: SFX-{id}'
              values={{ id }}
            />
          </Text>
          <Text style={spacing('mt-20')} size='14px' weight={400}>
            {isBuy ? (
              <FormattedMessage
                id='sfoxtradedetails.orderdetails.method'
                defaultMessage='Payment Method'
              />
            ) : (
              <FormattedMessage
                id='sfoxtradedetails.orderdetails.receivingfundsinto'
                defaultMessage='Receiving Funds Into'
              />
            )}
          </Text>
          <MethodContainer borderDark style={spacing('mt-5')}>
            <Icon name='bank-filled' size='30px' />
            <FundingSource account={account[0]} />
          </MethodContainer>
          <OrderDetailsTable style={spacing('mt-10')}>
            <OrderDetailsRow>
              {isBuy ? (
                <Text size='13px' weight={300}>
                  <FormattedMessage
                    id='sfoxtradedetails.orderdetails.amounttopurchase'
                    defaultMessage='BTC Amount to Purchase'
                  />
                </Text>
              ) : (
                <Text size='13px' weight={300}>
                  <FormattedMessage
                    id='sfoxtradedetails.orderdetails.amounttosell'
                    defaultMessage='BTC Amount to Sell'
                  />
                </Text>
              )}
              <Text size='13px' weight={300}>
                {renderFirstRow(trade)}
              </Text>
            </OrderDetailsRow>
            <OrderDetailsRow>
              <ToolTipWrapper>
                <Text size='13px' weight={300}>
                  <FormattedMessage
                    id='sfoxtradedetails.orderdetails.tradingfee'
                    defaultMessage='Trading Fee'
                  />
                  <TooltipHost id='tradingfee.tooltip'>
                    <TooltipIcon name='question-in-circle' />
                  </TooltipHost>
                </Text>
              </ToolTipWrapper>
              <Text size='13px' weight={300}>{`$${feeAmount.toFixed(2)}`}</Text>
            </OrderDetailsRow>
            <OrderDetailsRow>
              {isBuy ? (
                <Text size='13px' weight={300}>
                  <FormattedMessage
                    id='sfoxtradedetails.orderdetails.totalcost'
                    defaultMessage='Total Cost'
                  />
                </Text>
              ) : (
                <Text size='13px' weight={300}>
                  <FormattedMessage
                    id='sfoxtradedetails.orderdetails.totaltobereceived'
                    defaultMessage='Total to be Received'
                  />
                </Text>
              )}
              <Text size='13px' weight={300} color='success'>
                {renderTotal(trade)}
              </Text>
            </OrderDetailsRow>
            {expectedDelivery && (
              <OrderDetailsRow>
                <Text size='13px' weight={300}>
                  <FormattedMessage
                    id='sfoxtradedetails.orderdetails.fundsdelivery'
                    defaultMessage='Estimated Delivery of Funds'
                  />
                </Text>
                <Text size='13px' weight={300}>
                  {moment(expectedDelivery).format('dddd, MMMM Do YYYY')}
                </Text>
              </OrderDetailsRow>
            )}
          </OrderDetailsTable>
          <ButtonRow>
            <Button width='100px' onClick={this.props.close} nature='primary'>
              <FormattedMessage
                id='sfoxtradedetails.close'
                defaultMessage='Close'
              />
            </Button>
          </ButtonRow>
        </ModalBody>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  account: selectors.core.data.sfox
    .getAccounts(state)
    .getOrFail('No sfox accounts found')
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('SfoxTradeDetails'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(SfoxTradeDetails)
