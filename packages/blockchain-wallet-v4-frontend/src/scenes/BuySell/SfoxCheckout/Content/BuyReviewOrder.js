import React, { Fragment } from 'react'
import styled from 'styled-components'
import { Text, Button } from 'blockchain-info-components'
import FaqRow from 'components/Faq/FaqRow'
import { Wrapper as ExchangeCheckoutWrapper } from '../../ExchangeCheckout'
import { spacing } from 'services/StyleService'
import { FormattedMessage } from 'react-intl'
import { OrderDetailsTable, OrderDetailsRow } from './OrderDetails'

const StyledFaqRow = styled(FaqRow)`
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`

const renderDetailsRow = (id, message, value, color) => (
  <OrderDetailsRow>
    <Text size='13px' weight={400}><FormattedMessage id={id} defaultMessage={message} /></Text>
    <Text size='13px' weight={300} color={color}>{value}</Text>
  </OrderDetailsRow>
)

const renderDetailsTable = (quote) => (
  <OrderDetailsTable style={spacing('mt-20')}>
    {renderDetailsRow('order_details.amount_to_purchase', 'BTC Amount to Purchase', `${quote.baseAmount} BTC`)}
    {renderDetailsRow('order_details.trading_fee', 'Trading Fee', `- $${quote.feeAmount}`)}
    {renderDetailsRow('order_details.amount_to_receive', 'BTC Amount to be Received', `${quote.quoteAmount} BTC`, 'success')}
  </OrderDetailsTable>
)

export const BuyOrderDetails = ({ quoteR }) => (
  <ExchangeCheckoutWrapper>
    <Text size='32px' weight={600} style={spacing('mb-10')}>
      <FormattedMessage id='buy.almost_there' defaultMessage="You're almost there" />
    </Text>
    <Text size='14px' weight={300} style={spacing('mb-20')}>
      <FormattedMessage id='buy.review_order_subtext' defaultMessage='Before we can start processing your order, review the order details below. If everything looks good to you, click submit to complete your order.' />
    </Text>
    {quoteR.map(renderDetailsTable).getOrElse(null)}
  </ExchangeCheckoutWrapper>
)

export const BuyOrderSubmit = () => (
  <Fragment>
    <Button nature='primary'>
      <FormattedMessage id='submit' defaultMessage='Submit' />
    </Button>
    <StyledFaqRow
      title={<FormattedMessage id='faq.how_long_to_receive_q' defaultMessage='How long does it take to get my funds?' />}
      description={<FormattedMessage id='faq.how_long_to_receive_a' defaultMessage='A bitcoin is never late, nor is it early. A bitcoin arrives precisely when it intends to.' />}
    />
    <StyledFaqRow
      title={<FormattedMessage id='faq.exchange_rate_q' defaultMessage='What is the exchange rate?' />}
      description={<FormattedMessage id='faq.exchange_rate_a' defaultMessage='The exchange rate varies from minute to minute.' />}
    />
    <StyledFaqRow
      title={<FormattedMessage id='faq.exchange_fees_q' defaultMessage='What are the fees?' />}
      description={<FormattedMessage id='faq.exchange_fees_a' defaultMessage='Each exchange takes a small percentage of the total amount as a fee.' />}
    />
  </Fragment>
)
